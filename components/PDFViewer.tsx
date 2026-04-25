'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { drawWatermark } from '@/lib/watermark'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  pdfUrl: string
  email: string
}

export default function PDFViewer({ pdfUrl, email }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [devToolsOpen, setDevToolsOpen] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [containerWidth, setContainerWidth] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // DevTools detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault()
        setDevToolsOpen(true)
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    // Window-size devtools check — skip on touch devices (iPads/phones) where
    // browser chrome legitimately consumes enough space to trigger false positives
    let check: ReturnType<typeof setInterval> | null = null
    if (!navigator.maxTouchPoints) {
      const threshold = 160
      check = setInterval(() => {
        if (
          window.outerWidth - window.innerWidth > threshold ||
          window.outerHeight - window.innerHeight > threshold
        ) {
          setDevToolsOpen(true)
        } else {
          setDevToolsOpen(false)
        }
      }, 1000)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      if (check) clearInterval(check)
    }
  }, [])

  // Measure available width for responsive page sizing
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const applyWatermark = useCallback(
    (canvas: HTMLCanvasElement) => {
      drawWatermark(canvas, email)
    },
    [email]
  )

  // Apply watermark to canvases after render
  useEffect(() => {
    if (!containerRef.current) return
    const canvases = containerRef.current.querySelectorAll<HTMLCanvasElement>('canvas')
    canvases.forEach((c) => applyWatermark(c))
  })

  if (devToolsOpen) {
    return (
      <div className="fixed inset-0 bg-[#1a2e00] flex items-center justify-center z-50">
        <div className="text-center px-8">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-[#cde182] mb-3">Security Alert</h2>
          <p className="text-[#e2ecb7] max-w-md">
            Developer tools are not allowed while viewing notes. Please close developer tools to
            continue reading.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col items-center gap-4 w-full"
      style={{ userSelect: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
    >
      {/* Controls */}
      <div className="flex items-center gap-4 bg-white border border-[#d6e8a0] rounded-xl px-5 py-2 shadow-sm sticky top-16 z-10">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="text-[#3b6d11] disabled:opacity-30 hover:text-[#1a2e00] font-bold px-2"
        >
          ‹
        </button>
        <span className="text-sm text-[#3b6d11]">
          Page {currentPage} of {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
          disabled={currentPage >= numPages}
          className="text-[#3b6d11] disabled:opacity-30 hover:text-[#1a2e00] font-bold px-2"
        >
          ›
        </button>
        <div className="h-4 w-px bg-[#d6e8a0]" />
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="text-[#3b6d11] hover:text-[#1a2e00] font-bold px-1"
        >
          −
        </button>
        <span className="text-xs text-[#3b6d11] w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="text-[#3b6d11] hover:text-[#1a2e00] font-bold px-1"
        >
          +
        </button>
      </div>

      {/* PDF Document */}
      <div
        ref={containerRef}
        className="relative"
        style={{ pointerEvents: 'none' }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="flex items-center justify-center h-96 w-full">
              <div className="text-[#3b6d11] animate-pulse">Loading PDF...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center h-96">
              <p className="text-red-500">Failed to load PDF.</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={containerWidth ? Math.min(containerWidth, 900) * scale : undefined}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onRenderSuccess={() => {
              if (!containerRef.current) return
              const canvases =
                containerRef.current.querySelectorAll<HTMLCanvasElement>('canvas')
              canvases.forEach((c) => applyWatermark(c))
            }}
          />
        </Document>
      </div>
    </div>
  )
}
