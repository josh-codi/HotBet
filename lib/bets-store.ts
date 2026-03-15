import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { BettingSelection } from './betting-slip-store'

export type BetTicketStatus = 'pending' | 'won' | 'lost'

export type BetTicket = {
    id: string
    bookingCode: string
    stake: number
    totalOdds: number
    potentialPayout: number
    placedAt: string
    status: BetTicketStatus
    selections: BettingSelection[]
}

type BetsStore = {
    tickets: BetTicket[]
    hasHydrated: boolean
    setHasHydrated: (value: boolean) => void
    placeBet: (payload: { selections: BettingSelection[]; stake: number }) => BetTicket
    getTicketByCode: (bookingCode: string) => BetTicket | undefined
}

const createBookingCode = () => {
    const now = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    return `HB-${now.slice(-4)}${random}`
}

const calculateTotalOdds = (selections: BettingSelection[]) =>
    selections.reduce((acc, item) => acc * item.odd, 1)

export const useBetsStore = create<BetsStore>()(
    persist(
        (set, get) => ({
            tickets: [],
            hasHydrated: false,
            setHasHydrated: (value) => set({ hasHydrated: value }),
            placeBet: ({ selections, stake }) => {
                const totalOdds = calculateTotalOdds(selections)
                const safeStake = Number(Math.max(0, stake).toFixed(2))
                const potentialPayout = Number((safeStake * totalOdds).toFixed(2))

                const ticket: BetTicket = {
                    id: crypto.randomUUID(),
                    bookingCode: createBookingCode(),
                    stake: safeStake,
                    totalOdds: Number(totalOdds.toFixed(2)),
                    potentialPayout,
                    placedAt: new Date().toISOString(),
                    status: 'pending',
                    selections
                }

                set((state) => ({
                    tickets: [ticket, ...state.tickets]
                }))

                return ticket
            },
            getTicketByCode: (bookingCode) => {
                const normalized = bookingCode.trim().toUpperCase()
                return get().tickets.find((ticket) => ticket.bookingCode.toUpperCase() === normalized)
            }
        }),
        {
            name: 'hotbet-tickets-v1',
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)
