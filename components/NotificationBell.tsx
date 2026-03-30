'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type Notif = {
  id: string
  title: string
  body: string
  url: string | null
  created_at: string
}

type PushStatus = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const [pushStatus, setPushStatus] = useState<PushStatus>('loading')
  const [pushWorking, setPushWorking] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Fetch notifications + push status on mount
  useEffect(() => {
    fetchNotifs()
    checkPushStatus()
  }, [])

  const fetchNotifs = async () => {
    const res = await fetch('/api/notifications')
    if (!res.ok) return
    const data: Notif[] = await res.json()
    setNotifs(data)

    // Unread = newer than last seen timestamp stored in localStorage
    const lastSeen = localStorage.getItem('notif_last_seen')
    if (lastSeen) {
      const count = data.filter((n) => new Date(n.created_at) > new Date(lastSeen)).length
      setUnread(count)
    } else {
      setUnread(data.length)
    }
  }

  const handleOpen = () => {
    setOpen((prev) => {
      if (!prev) {
        // Mark all as read
        localStorage.setItem('notif_last_seen', new Date().toISOString())
        setUnread(0)
      }
      return !prev
    })
  }

  const checkPushStatus = async () => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushStatus('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setPushStatus('denied')
      return
    }
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      if (registrations.length === 0) {
        setPushStatus('unsubscribed')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      setPushStatus(sub ? 'subscribed' : 'unsubscribed')
    } catch {
      setPushStatus('unsubscribed')
    }
  }

  const subscribePush = async () => {
    setPushWorking(true)
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setPushStatus('denied')
        setPushWorking(false)
        return
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      })
      setPushStatus('subscribed')
    } catch (err) {
      console.error('Push subscribe failed:', err)
    }
    setPushWorking(false)
  }

  const unsubscribePush = async () => {
    setPushWorking(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setPushStatus('unsubscribed')
    } catch (err) {
      console.error('Push unsubscribe failed:', err)
    }
    setPushWorking(false)
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-lg hover:bg-[#f9fbf2] transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 text-[#cde182]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-9 w-80 bg-white border border-[#d6e8a0] rounded-2xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0f7da]">
            <span className="font-bold text-sm text-[#1a2e00]">Notifications</span>

            {/* Push toggle */}
            {pushStatus !== 'loading' && pushStatus !== 'unsupported' && (
              <button
                onClick={pushStatus === 'subscribed' ? unsubscribePush : subscribePush}
                disabled={pushWorking || pushStatus === 'denied'}
                title={
                  pushStatus === 'denied'
                    ? 'Blocked in browser settings'
                    : pushStatus === 'subscribed'
                    ? 'Turn off push notifications'
                    : 'Enable push notifications'
                }
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors disabled:opacity-50 ${
                  pushStatus === 'subscribed'
                    ? 'bg-[#e2ecb7] text-[#1a2e00]'
                    : pushStatus === 'denied'
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-500 hover:bg-[#e2ecb7] hover:text-[#1a2e00]'
                }`}
              >
                {pushWorking ? (
                  '...'
                ) : pushStatus === 'subscribed' ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-[#3b6d11] rounded-full" />
                    Push on
                  </>
                ) : pushStatus === 'denied' ? (
                  'Blocked'
                ) : (
                  'Enable push'
                )}
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#3b6d11]">
                <p className="text-2xl mb-2">🔔</p>
                No notifications yet
              </div>
            ) : (
              notifs.map((n) => (
                <Link
                  key={n.id}
                  href={n.url || '/dashboard'}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-4 py-3 hover:bg-[#f9fbf2] transition-colors border-b border-[#f9fbf2] last:border-0"
                >
                  <div className="w-8 h-8 bg-[#e2ecb7] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">📚</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a2e00] leading-tight">{n.title}</p>
                    <p className="text-xs text-[#3b6d11] mt-0.5 leading-snug">{n.body}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}
