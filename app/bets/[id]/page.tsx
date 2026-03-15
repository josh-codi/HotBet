'use client'
import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import Wrapper from '@/components/Wrapper'
import { useBetsStore } from '@/lib/bets-store'
import { useParams } from 'next/navigation'
import React from 'react'

export default function BetDetails() {
    const params = useParams();
    const ticket = useBetsStore((state) => state.tickets.find(t => t.id === params.id))

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4 flex-row items-start'>
                <div className="flex flex-col w-full">
                    <div className="w-full flex items-center justify-between">
                        <GoBack/>
                        <span className="text-sm text-muted-foreground text-nowrap">Bet #{ticket?.bookingCode}</span>
                    </div>

                    <div className="w-full p-3 border rounded-lg flex flex-col gap-1 my-2 text-sm">
                        <span className="w-full flex items-center justify-between">
                            <p>Odds:</p>
                            <p>8</p>
                        </span>
                        <span className="w-full flex items-center justify-between">
                            <p>Stake:</p>
                            <p>GHS 54.00</p>
                        </span>
                        <span className="w-full flex items-center justify-between">
                            <p>Potential Payout:</p>
                            <p>GHS {ticket?.potentialPayout}</p>
                        </span>
                    </div>
                    <br />
                    <div className="w-full flex flex-col gap-1">
                        {
                            ticket?.selections.map((selection, index) => (
                                <div key={index} className="w-full flex flex-col gap-1">
                                    <span className="w-full flex items-center justify-between">
                                        <p>{selection.homeTeam} vs {selection.awayTeam}</p>
                                        <p>{selection.odd}</p>
                                    </span>
                                    <span className="w-full flex items-center justify-between">
                                        <p>Pick:</p>
                                        <p>{selection.option}</p>
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <BettingSlip/>
            </Wrapper>
        </div>
    )
}
