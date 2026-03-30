import Link from 'next/link'
import type { Note } from '@/lib/supabase'

interface NoteCardProps {
  note: Note
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="bg-white border border-[#d6e8a0] rounded-xl p-5 hover:shadow-md hover:border-[#cde182] transition-all">
      <div className="flex items-start justify-between mb-3">
        <span className="bg-[#e2ecb7] text-[#3b6d11] text-xs font-bold px-2 py-1 rounded-full">
          Ch. {note.chapter_number}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${note.is_free ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
          {note.is_free ? 'Free' : 'Paid'}
        </span>
      </div>
      <h3 className="font-semibold text-[#1a2e00] text-sm leading-tight mb-4">
        {note.title}
      </h3>
      <Link
        href={`/notes/${note.id}`}
        className="block w-full text-center bg-[#cde182] text-[#1a2e00] text-sm font-bold py-2 rounded-lg hover:bg-[#b8d06e] transition-colors"
      >
        Read Now
      </Link>
    </div>
  )
}
