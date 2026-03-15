import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BettingSelection = {
    id: string
    matchId: number
    homeTeam: string
    awayTeam: string
    market: string
    option: string
    odd: number
}

type BettingSlipState = {
    selections: BettingSelection[]
    hasHydrated: boolean
    setHasHydrated: (value: boolean) => void
    setSelections: (selections: BettingSelection[]) => void
    toggleSelection: (selection: BettingSelection) => void
    removeSelection: (selectionId: string) => void
    clearSelections: () => void
}

export const buildSelectionId = (matchId: number, market: string, option: string) =>
    `${matchId}:${market}:${option}`

export const useBettingSlipStore = create<BettingSlipState>()(
    persist(
        (set) => ({
            selections: [],
            hasHydrated: false,
            setHasHydrated: (value) => set({ hasHydrated: value }),
            setSelections: (selections) => set({ selections }),
            toggleSelection: (selection) =>
                set((state) => {
                    const exists = state.selections.some((item) => item.id === selection.id)

                    return {
                        selections: exists
                            ? state.selections.filter((item) => item.id !== selection.id)
                            : [
                                ...state.selections.filter((item) => item.matchId !== selection.matchId),
                                selection
                            ]
                    }
                }),
            removeSelection: (selectionId) =>
                set((state) => ({
                    selections: state.selections.filter((item) => item.id !== selectionId)
                })),
            clearSelections: () => set({ selections: [] })
        }),
        {
            name: 'hotbet-slip-v1',
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)