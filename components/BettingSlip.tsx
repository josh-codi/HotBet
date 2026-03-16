'use client'

import React from 'react'
import { Info, Share2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useBettingSlipStore } from '../lib/betting-slip-store'
import { useBetsStore } from '@/lib/bets-store'
import BrandName from './BrandName'
import Link from 'next/link'
import routes from '@/routes'

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
            <div className="w-full min-h-14 flex items-center justify-between bg-slate-900 text-white px-3 py-2 md:rounded sticky top-0 z-10">
                <BrandName className='text-lg text-primary border w-fit py-0.5 px-1.5 rounded' />
                <div className="flex items-center gap-4">
                    <span id='account-balance' className='text-sm'>GHS 8574</span>
                    <button className="p-1 md:hidden" onClick={() => setShowing(false)} aria-label='Close betting slip'>
                        <X className='size-5 cursor-pointer' />
                    </button>
                </div>
            </div>

            <div className="w-full md:h-full h-fit flex flex-col gap-3 min-h-0 md:px-0 px-3">
                <div className="w-full border flex flex-col gap-2 p-2 rounded bg-gray-100">
                    <p className="text-sm font-medium">Booking code</p>
                    <Input
                        type="text"
                        value={bookingCode}
                        onChange={(event) => setBookingCode(event.target.value)}
                        placeholder='Enter booking code'
                        className="h-9 w-full placeholder:text-sm rounded border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    <Button size='sm' className='w-full rounded' onClick={loadBetByCode}>Load Bet</Button>
                </div>

                <div className="w-full flex items-center justify-between py-1.5 border-y">
                    <div>
                        <p className="text-sm font-medium">Your Selections</p>
                        <p className="text-xs text-muted-foreground">{selections.length} item(s)</p>
                    </div>
                    <button onClick={() => clearSelections()} className='md:hidden flex items-center gap-1 text-sm'>
                        <X className='size-4' /> Clear
                    </button>
                </div>

                <div className="w-full h-fit flex flex-col gap-2">
                    {!slipHydrated ? (
                        <p className='text-sm text-muted-foreground'>Loading your selections...</p>
                    ) : selections.length === 0 ? (
                        <div className="w-full flex flex-col items-center gap-2 py-14 text-center">
                            <b className='text-[3rem] text-gray-400'>∅</b>
                            <div className="flex flex-col">
                                <p className='text-sm text-muted-foreground'>No selections added yet.</p>
                                <span>Discover more <Link href={routes.home} className='underline'>here</Link></span>
                            </div>
                        </div>
                    ) : selections.map((selection) => (
                        <div key={selection.id} className="w-full rounded border border-border p-2">
                            <div className="w-full flex flex-col gap-1">
                                <div className="w-full flex items-center justify-between">
                                    <Link href={routes.match.index(selection.matchId)} className="text-sm font-medium wrap-break-word underline">
                                        {selection.homeTeam} vs {selection.awayTeam}
                                    </Link>
                                    <button onClick={() => removeSelection(selection.id)} className='text-red-500 hover:text-red-600'>
                                        <X className='size-4' />
                                    </button>
                                </div>
                                <div className="w-full flex items-center justify-between">
                                    <span className='text-xs text-muted-foreground capitalize'>
                                        {selection.market} • {selection.option}
                                    </span>
                                    <span className='text-xs font-semibold'>Odd: {selection.odd.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <span className='w-full flex items-center justify-between text-sm'>
                    <span className=''>Total Odds</span>
                    <span className=''>{selections.length > 0 ? totalOdds.toFixed(2) : '0.00'}</span>
                </span>
                {
                    selections.length ? <>
                        <div className="flex flex-col gap-2 p-3 rounded bg-slate-900 dark:bg-background text-gray-100">
                            <div className='flex flex-col gap-1 mt-2'>
                                <label className='text-xs text-white'>Your Stake</label>
                                <Input
                                    type='number'
                                    min={1}
                                    step='0.01'
                                    value={stake}
                                    onChange={(event) => setStake(event.target.value)}
                                    className='h-9 w-full rounded text-black border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
                                />
                            </div>
                            <div className='flex items-center justify-between text-sm'>
                                <span className='text-white'>Potential payout</span>
                                <span className='font-semibold'>GHS {potentialPayout.toFixed(2)}</span>
                            </div>
                            <div className="w-full flex items-center gap-2 text-sm mt-5">
                                <Button size='lg' className='flex-1' onClick={handlePlaceBet} disabled={!slipHydrated || !betsHydrated}>Place Bet</Button>
                                <Button variant='outline' size='lg' className='flex-1 text-black' onClick={handleShare} disabled={!slipHydrated}>
                                    <Share2 className='size-4' />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {feedback && (
                            <p className='text-xs text-muted-foreground'>{feedback}</p>
                        )}
                        {selections.length > 0 && (
                            <Button variant='ghost' size='sm' className='w-full' onClick={clearSelections}>
                                Clear selections
                            </Button>
                        )}
                    </> : null
                }
            </div>

        </>
    )

    return <>
        <div className='md:hidden'>
            <Button
                id='show-betting-slip'
                onClick={() => setShowing(true)}
                size='sm'
                className='fixed h-12 sm:h-14 px-3 bottom-4 right-0 z-40 flex items-center gap-2 rounded-full rounded-r-none shadow-md'
            >
                <div className="size-7 rounded-full flex items-center justify-center border border-primary text-primary bg-white">{selections.length}</div>
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
                    className={`overflow-y-auto absolute right-0 top-0 h-full w-full sm:w-[min(90vw,360px)] bg-background shadow-xl transition-transform duration-300 ${showing ? 'translate-x-0' : 'translate-x-full'} flex flex-col gap-3`}
                >
                    {slipBody}
                </aside>
            </div>
        </div>

        <div className='overflow-y-auto hidden md:flex md:sticky md:top-16 h-dvh md:h-[75vh] md:w-75 md:min-w-75 md:rounded-2xl md:border md:border-border md:bg-card md:p-4 md:shadow-none flex-col gap-3 z-10'>
            {slipBody}
        </div>
    </>
}
