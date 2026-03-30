import webpush from 'web-push'

let _configured = false

export function getWebPush() {
  if (!_configured) {
    webpush.setVapidDetails(
      process.env.VAPID_MAILTO ?? 'mailto:admin@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '',
      process.env.VAPID_PRIVATE_KEY ?? ''
    )
    _configured = true
  }
  return webpush
}

export async function sendPushToAll(
  subscriptions: { endpoint: string; p256dh: string; auth: string }[],
  payload: { title: string; body: string; url?: string }
) {
  const wp = getWebPush()
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      wp.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      )
    )
  )
  return results
}
