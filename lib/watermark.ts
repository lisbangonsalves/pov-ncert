'use client'

export function drawWatermark(canvas: HTMLCanvasElement, email: string) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.fillStyle = '#3b6d11'
  ctx.font = '14px Arial'

  const text = email || 'POV:NCERT'
  const spacing = 140

  for (let y = -height; y < height * 2; y += spacing) {
    for (let x = -width; x < width * 2; x += spacing) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((-30 * Math.PI) / 180)
      ctx.fillText(text, 0, 0)
      ctx.restore()
    }
  }

  ctx.restore()
}
