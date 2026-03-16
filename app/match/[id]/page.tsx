'use client'

import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import Tag from '@/components/Tag'
import { Button } from '@/components/ui/button'
import Wrapper from '@/components/Wrapper'
import matches from '@/constants/matches'
import { buildSelectionId, useBettingSlipStore } from '@/lib/betting-slip-store'
import { useParams } from 'next/navigation'
import React from 'react'

type Match = (typeof matches)[number]
type OddsGroups = Match['odds']
type OddsGroupKey = keyof OddsGroups

export default function MatchPage() {
    const params = useParams()
    const match = matches.find((item) => item.id === Number(params.id))
    const selections = useBettingSlipStore((state) => state.selections)
    const toggleSelection = useBettingSlipStore((state) => state.toggleSelection)

    const tabConfig = [
        { key: 'all', label: 'All Markets' },
        { key: 'matchResult', label: 'Match Result' },
        { key: 'bothTeamsToScore', label: 'BTTS' },
        { key: 'goals', label: 'Goals' },
        { key: 'doubleChance', label: 'Double Chance' },
        { key: 'correctScore', label: 'Correct Score' },
        { key: 'firstHalfResult', label: '1st Half' },
        { key: 'drawNoBet', label: 'Draw No Bet' },
        { key: 'cleanSheet', label: 'Clean Sheet' }
    ] as const

    const [activeTab, setActiveTab] = React.useState<(typeof tabConfig)[number]['key']>('all')

    if (!match) {
        return (
            <div className='w-full flex justify-center py-10'>
                <p>Match not found.</p>
            </div>
        )
    }

    const labelize = (value: string) => value
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())

    const formatDate = (isoDate: string) => new Date(isoDate).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const oddsByGroup: Record<OddsGroupKey, Record<string, number>> = match.odds
    const marketGroups: Array<{ key: OddsGroupKey; title: string; values: Record<string, number> }> =
        activeTab === 'all'
            ? (Object.keys(oddsByGroup) as OddsGroupKey[])
                .filter((key) => key !== 'handicap')
                .map((key) => ({
                    key,
                    title: tabConfig.find((tab) => tab.key === key)?.label ?? labelize(key),
                    values: oddsByGroup[key]
                }))
            : [
                {
                    key: activeTab as OddsGroupKey,
                    title: tabConfig.find((tab) => tab.key === activeTab)?.label ?? labelize(activeTab),
                    values: oddsByGroup[activeTab as OddsGroupKey]
                }
            ]

    const renderSelectionButton = (market: string, option: string, odd: number, label?: string, className?: string) => {
        const selectionId = buildSelectionId(match.id, market, option)
        const isSelected = selections.some((selection) => selection.id === selectionId)

        return (
            <Button
                key={`${market}-${option}`}
                type='button'
                variant={isSelected ? 'default' : 'secondary'}
                className={`h-auto min-h-10 w-full justify-between px-3 py-2 ${className}`}
                onClick={() =>
                    toggleSelection({
                        id: selectionId,
                        matchId: match.id,
                        homeTeam: match.homeTeam,
                        awayTeam: match.awayTeam,
                        market,
                        option,
                        odd
                    })
                }
            >
                <span className='text-xs text-center leading-tight opacity-80'>
                    {label ?? labelize(option)}
                </span>
                <span className='text-xs font-semibold'>{odd.toFixed(2)}</span>
            </Button>
        )
    }

    return (
        <div className='w-full flex flex-col items-center gap-4 py-4 sm:py-6'>
            <Wrapper className='w-full max-w-full gap-4 px-3 sm:px-4 md:px-6 lg:flex-row lg:items-start lg:gap-6 lg:px-0'>
                <div className='flex min-w-0 w-full flex-col gap-4 sm:gap-5'>
                    <GoBack />
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                            <div className='w-full'>
                                <div className="w-full flex items-center justify-between mb-3">
                                    <p className='text-xs sm:text-sm text-muted-foreground'>{match.league}</p>
                                    <Tag status={match.status} />
                                </div>

                                <div className='flex flex-col w-full sm:text-xl md:text-2xl font-semibold leading-tight '>
                                    <span className="w-full">{match.homeTeam}</span>
                                    <span className="w-full">{match.awayTeam}</span>
                                </div>
                                <span className='text-[11px] sm:text-xs text-center text-muted-foreground'>
                                    {formatDate(match.dateTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <section className='w-full flex flex-col gap-4'>
                        <div className='w-full bg-gray-100 p-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                            {tabConfig.map((tab) => (
                                <button
                                    key={tab.key}
                                    type='button'
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`shrink-0 rounded border px-3 py-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background hover:bg-muted'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className='flex flex-col gap-1 text-sm'>
                            {marketGroups.map((group) => {
                                if (Object.keys(group.values).length === 0) return null
                                if (group.key === 'goals') {
                                    const overs = Object.entries(group.values).filter(([option]) => option.toLowerCase().includes('over'))
                                    const unders = Object.entries(group.values).filter(([option]) => option.toLowerCase().includes('under'))

                                    return (
                                        <div key={group.key} className='space-y-3 border-t py-2'>
                                            <h3 className='text-base font-medium'>{group.title}</h3>
                                            <div className='grid gap-2 grid-cols-2'>
                                                <div className='flex flex-col gap-2'>
                                                    {overs.map(([option, odd]) => renderSelectionButton(group.title, option, odd))}
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                    {unders.map(([option, odd]) => renderSelectionButton(group.title, option, odd))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                if (group.key === 'doubleChance') {
                                    const homeOrDraw = group.values['homeOrDraw']
                                    const awayOrDraw = group.values['awayOrDraw']
                                    const homeOrAway = group.values['homeOrAway']

                                    return (
                                        <div key={group.key} className='space-y-3 border-t py-2'>
                                            <h3 className='text-base font-medium'>{group.title}</h3>
                                            <div className='grid grid-cols-3 gap-2'>
                                                {homeOrDraw && renderSelectionButton(group.title, 'homeOrDraw', homeOrDraw, 'H/D', 'w-full')}
                                                {awayOrDraw && renderSelectionButton(group.title, 'awayOrDraw', awayOrDraw, 'A/D', 'w-full')}
                                                {homeOrAway && renderSelectionButton(group.title, 'homeOrAway', homeOrAway, 'H/A', 'w-full')}
                                            </div>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={group.key} className='space-y-3 border-t py-2'>
                                        <h3 className='text-base font-medium'>{group.title}</h3>
                                        <div className='w-full grid grid-cols-3 gap-2 '>
                                            {Object.entries(group.values).map(([option, odd]) => (
                                                renderSelectionButton(group.title, option, odd)
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                </div>

                <BettingSlip />
            </Wrapper>
        </div>
    )
}
