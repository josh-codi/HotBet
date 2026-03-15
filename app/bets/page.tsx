"use client"

import Wrapper from '@/components/Wrapper'
import { useBetsStore } from '@/lib/bets-store'
import React from 'react'
import BetCard from './Includes/BetCard'
import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'

const tabs = [
    { id: 'all', label: 'All Bets' },
    { id: 'pending', label: 'Pending' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' }
]

export default function BetsPage() {
    const [activeTab, setActiveTab] = React.useState('all')
    const hasHydrated = useBetsStore((state) => state.hasHydrated)
    const tickets = useBetsStore((state) => state.tickets)

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4 flex-row items-start'>
                <section className="w-full flex flex-col gap-4">
                    <div className='w-full flex flex-col'>
                        <GoBack />
                        <h1 className='text-xl font-semibold'>My Bets</h1>
                        <p className='text-sm text-muted-foreground'>Track your placed tickets and booking codes.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-transparent text-muted-foreground hover:border-primary/40 hover:text-primary'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <section className="flex flex-col gap-4 w-full">
                        {!hasHydrated ? (
                            <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
                                Loading your bets...
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className='rounded-lg border p-6 text-sm text-muted-foreground'>
                                You have no placed bets yet. Add selections and place a bet from the betting slip.
                            </div>
                        ) : (
                            tickets.map((ticket) => {
                                return <BetCard key={ticket.id} ticket={ticket} />
                            })
                        )}
                    </section>
                </section>
                <BettingSlip />
            </Wrapper>
        </div>
    )
}
