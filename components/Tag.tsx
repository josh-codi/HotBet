import React from 'react'

type TagStatus = 'live' | 'pending' | 'finished' | 'won' | 'lost'

type TagProps = {
    status: TagStatus
}

const statusStyles: Record<TagStatus, string> = {
    live: 'border-red-200 bg-red-100 text-red-700',
    pending: 'border-amber-200 bg-amber-100 text-amber-700',
    finished: 'border-zinc-200 bg-zinc-100 text-zinc-700',
    won: 'border-green-200 bg-green-100 text-green-700',
    lost: 'border-slate-300 bg-slate-100 text-slate-700'
}

export default function Tag({ status }: TagProps) {
    return (
        <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>
            {status}
        </span>
    )
}
