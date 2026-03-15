'use client'

import React from 'react'
import { Info, Share2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useBettingSlipStore } from '../lib/betting-slip-store'
import { useBetsStore } from '@/lib/bets-store'
import BrandName from './BrandName'

export default function BettingSlip() {
    const [showing, setShowing] = React.useState(false)
    const [stake, setStake] = React.useState('10')
    const [bookingCode, setBookingCode] = React.useState('')
    const [feedback, setFeedback] = React.useState('')
    const slipHydrated = useBettingSlipStore((state) => state.hasHydrated)
    const betsHydrated = useBetsStore((state) => state.hasHydrated)
    const selections = useBettingSlipStore((state) => state.selections)
    const setSelections = useBettingSlipStore((state) => state.setSelections)
    const removeSelection = useBettingSlipStore((state) => state.removeSelection)
    const clearSelections = useBettingSlipStore((state) => state.clearSelections)
    const placeBet = useBetsStore((state) => state.placeBet)
    const getTicketByCode = useBetsStore((state) => state.getTicketByCode)

    const totalOdds = selections.reduce((total, selection) => total * selection.odd, 1)
    const numericStake = Number(stake)
    const potentialPayout = Number.isFinite(numericStake)
        ? Math.max(0, numericStake) * totalOdds
        : 0

    const loadBetByCode = () => {
        if (!betsHydrated) {
            setFeedback('Please wait, loading your bet history...')
            return
        }

        if (!bookingCode.trim()) {
            setFeedback('Enter a booking code to load a ticket.')
            return
        }

        const ticket = getTicketByCode(bookingCode)
        if (!ticket) {
            setFeedback('Ticket not found. Check the booking code and try again.')
            return
        }

        setSelections(ticket.selections)
        setStake(String(ticket.stake))
        setFeedback(`Loaded ${ticket.selections.length} selection(s) from ${ticket.bookingCode}.`)
        setShowing(false)
    }

    const handlePlaceBet = () => {
        if (!slipHydrated || !betsHydrated) {
            setFeedback('Please wait, your betting data is still loading...')
            return
        }

        if (selections.length === 0) {
            setFeedback('Add at least one selection before placing a bet.')
            return
        }

        if (!Number.isFinite(numericStake) || numericStake <= 0) {
            setFeedback('Enter a valid stake greater than 0.')
            return
        }

        const ticket = placeBet({ selections, stake: numericStake })
        clearSelections()
        setBookingCode(ticket.bookingCode)
        setFeedback(`Bet placed successfully. Booking code: ${ticket.bookingCode}`)
        setShowing(false)
    }

    const handleShare = async () => {
        if (selections.length === 0) {
            setFeedback('Add selections to share your betting slip.')
            return
        }

        const text = `HotBet slip\nSelections: ${selections.length}\nTotal Odds: ${totalOdds.toFixed(2)}\nStake: ${Number.isFinite(numericStake) ? numericStake.toFixed(2) : '0.00'}\nPotential Payout: ${potentialPayout.toFixed(2)}`

        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({
                    title: 'HotBet Slip',
                    text
                })
                setFeedback('Bet slip shared successfully.')
                return
            }

            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
                setFeedback('Slip details copied to clipboard.')
                return
            }

            setFeedback('Sharing is not available on this device.')
        } catch {
            setFeedback('Unable to share right now. Please try again.')
        }
    }

    const slipBody = (
        <>
            <div className="flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                    <BrandName className='text-xl text-primary border w-fit py-1 px-2 rounded-xl'/>
                    <span id='account-balance'>GHS 8574</span>
                </div>
                <p className="text-sm font-medium">Booking code</p>
                <Input
                    type="text"
                    value={bookingCode}
                    onChange={(event) => setBookingCode(event.target.value)}
                    placeholder='Enter booking code'
                    className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <Button size='sm' className='w-full' onClick={loadBetByCode}>Load Bet</Button>
            </div>

            <div className="w-full h-full flex flex-col min-h-0">
                <div className="w-full flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Your Selections</p>
                        <p className="text-xs text-muted-foreground">{selections.length} item(s)</p>
                    </div>
                    <button onClick={() => setShowing(false)} className='md:hidden'>
                        <X className='size-4' />
                    </button>
                </div>

                <div className="w-full h-full mt-3 flex flex-col gap-2 overflow-y-auto">
                    {!slipHydrated ? (
                        <p className='text-sm text-muted-foreground'>Loading your selections...</p>
                    ) : selections.length === 0 ? (
                        <p className='text-sm text-muted-foreground'>No selections added yet.</p>
                    ) : selections.map((selection) => (
                        <div key={selection.id} className="w-full rounded-lg border border-border p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex flex-col gap-1">
                                    <span className="text-sm font-medium wrap-break-word">
                                        {selection.homeTeam} vs {selection.awayTeam}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        {selection.market} • {selection.option}
                                    </span>
                                    <span className='text-xs font-semibold'>Odd: {selection.odd.toFixed(2)}</span>
                                </div>
                                <button onClick={() => removeSelection(selection.id)} className='text-red-500 hover:text-red-600'>
                                    <X className='size-4' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full flex flex-col gap-2 border-t border-border pt-3">
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Total Odds</span>
                    <span className='font-semibold'>{selections.length > 0 ? totalOdds.toFixed(2) : '0.00'}</span>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-xs text-muted-foreground'>Stake</label>
                    <Input
                        type='number'
                        min={1}
                        step='0.01'
                        value={stake}
                        onChange={(event) => setStake(event.target.value)}
                        className='h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
                    />
                </div>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Potential payout</span>
                    <span className='font-semibold'>{potentialPayout.toFixed(2)}</span>
                </div>
                <div className="w-full flex items-center gap-2 text-sm mt-2">
                    <Button size='lg' className='flex-1' onClick={handlePlaceBet} disabled={!slipHydrated || !betsHydrated}>Place Bet</Button>
                    <Button variant='outline' size='lg' className='flex-1' onClick={handleShare} disabled={!slipHydrated}>
                        <Share2 className='size-4' />
                        Share
                    </Button>
                </div>
                {feedback && (
                    <p className='text-xs text-muted-foreground'>{feedback}</p>
                )}
                {selections.length > 0 && (
                    <Button variant='ghost' size='sm' className='w-full' onClick={clearSelections}>
                        Clear selections
                    </Button>
                )}
            </div>
        </>
    )

    return <>
        <div className='md:hidden'>
            <Button
                onClick={() => setShowing(true)}
                variant='outline'
                size='sm'
                className='fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-background shadow-md'
            >
                <Info className='size-4' />
                Show Betting Slip
            </Button>

            <div
                className={`fixed inset-0 z-50 transition-opacity duration-300 ${showing ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-hidden={!showing}
            >
                <button
                    type='button'
                    onClick={() => setShowing(false)}
                    className='absolute inset-0 bg-black/45'
                    aria-label='Close betting slip'
                />
                <aside
                    className={`absolute right-0 top-0 h-full w-[min(90vw,360px)] border-l border-border bg-background p-4 shadow-xl transition-transform duration-300 ${showing ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-3`}
                >
                    {slipBody}
                </aside>
            </div>
        </div>

        <div className='hidden md:flex md:sticky md:top-16 md:h-[75vh] md:w-75 md:min-w-75 md:rounded-2xl md:border md:border-border md:bg-card md:p-4 md:shadow-none flex-col gap-3 z-50'>
            {slipBody}
        </div>
    </>
}
