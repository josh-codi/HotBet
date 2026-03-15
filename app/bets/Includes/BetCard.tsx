import { BetTicket } from '@/lib/bets-store'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function BetCard({ ticket }: { ticket: BetTicket }) {
    return (
        <Link href={routes.bets.ticket(ticket.id)} key={ticket.id} className="w-full flex flex-col rounded-lg border text-sm overflow-hidden">
            <div className="w-full p-4 flex flex-wrap items-center justify-between gap-2 bg-muted/35">
                <span>{new Date(ticket.placedAt).toLocaleString()}</span>
                <span className="text-muted-foreground">Code: {ticket.bookingCode}</span>
            </div>
            <div className="px-4 py-3 flex flex-col gap-3">
                <div className="w-full flex items-center justify-between py-2 border-b">
                    <span className="flex flex-col">
                        <small>Status</small>
                        <span className="flex items-center gap-1 capitalize font-semibold">{ticket.status}</span>
                    </span>
                    <span>0/{ticket.selections.length}</span>
                </div>

                <div className='grid grid-cols-3 gap-3'>
                    <div className="flex flex-col items-start">
                        <small className="text-muted-foreground">Stake</small>
                        <p>{ticket.stake.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-start">
                        <small className="text-muted-foreground">Odds</small>
                        <p>{ticket.totalOdds.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <small className="text-muted-foreground">Potential payout</small>
                        <p>GHS {ticket.potentialPayout.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}
