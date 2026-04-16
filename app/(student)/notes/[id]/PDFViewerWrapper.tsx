'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="text-[#3b6d11] animate-pulse">Loading secure viewer...</div>
    </div>
  ),
})

interface PDFViewerWrapperProps {
  noteId: string
  userEmail: string
}

export default function PDFViewerWrapper({ noteId, userEmail }: PDFViewerWrapperProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let objectUrl: string | null = null

    const fetchPdf = async () => {
      try {
        const res = await fetch(`/api/pdf/${noteId}`)
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || 'Failed to load PDF')
          return
        }
        const blob = await res.blob()
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      } catch {
        setError('Failed to load PDF')
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [noteId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#3b6d11] animate-pulse">Loading secure viewer...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <a href="/dashboard" className="text-[#3b6d11] underline text-sm">
            Back to dashboard
          </a>
        </div>
      </div>
    )
  }

  if (!pdfUrl) return null

  return <PDFViewer pdfUrl={pdfUrl} email={userEmail} />
}
