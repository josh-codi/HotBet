'use client'

import BettingSlip from '@/components/BettingSlip'
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
        { key: 'handicap', label: 'Handicap' },
        { key: 'firstHalfResult', label: '1st Half' },
        { key: 'drawNoBet', label: 'Draw No Bet' },
        { key: 'cleanSheet', label: 'Clean Sheet' }
    ] as const

    const handicapLines = [
        { line: '+1.5', home: 'home +1.5', away: 'away -1.5' },
        { line: '+1.0', home: 'home +1.0', away: 'away -1.0' },
        { line: '+0.5', home: 'home +0.5', away: 'away -0.5' },
        { line: '-0.5', home: 'home -0.5', away: 'away +0.5' },
        { line: '-1.0', home: 'home -1.0', away: 'away +1.0' },
        { line: '-1.5', home: 'home -1.5', away: 'away +1.5' }
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
    const statusTone = match.status === 'live'
        ? 'border-green-200 bg-green-100 text-green-700'
        : match.status === 'finished'
            ? 'border-zinc-200 bg-zinc-100 text-zinc-700'
            : 'border-amber-200 bg-amber-100 text-amber-700'

    const marketGroups: Array<{ key: OddsGroupKey; title: string; values: Record<string, number> }> =
        activeTab === 'all'
            ? (Object.keys(oddsByGroup) as OddsGroupKey[]).map((key) => ({
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

    const renderSelectionButton = (market: string, option: string, odd: number, label?: string) => {
        const selectionId = buildSelectionId(match.id, market, option)
        const isSelected = selections.some((selection) => selection.id === selectionId)

        return (
            <Button
                key={`${market}-${option}`}
                type='button'
                variant={isSelected ? 'default' : 'secondary'}
                className='h-auto min-h-14 w-full flex-col gap-1 px-3 py-2'
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
                <span className='text-[11px] sm:text-xs text-center leading-tight opacity-80'>
                    {label ?? labelize(option)}
                </span>
                <span className='text-sm font-semibold'>{odd.toFixed(2)}</span>
            </Button>
        )
    }

    return (
        <div className='w-full flex flex-col items-center gap-4 py-4 sm:py-6'>
            <Wrapper className='w-full max-w-full gap-4 px-3 sm:px-4 md:px-6 lg:flex-row lg:items-start lg:gap-6 lg:px-0'>
                <div className='flex min-w-0 w-full flex-col gap-4 sm:gap-5'>
                    <section className='w-full rounded-2xl border bg-card p-4 sm:p-5 lg:p-6'>
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                                <div>
                                    <p className='text-xs sm:text-sm text-muted-foreground'>{match.league}</p>
                                    <h1 className='text-xl sm:text-2xl font-semibold leading-tight'>
                                        {match.homeTeam} vs {match.awayTeam}
                                    </h1>
                                </div>
                                <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusTone}`}>
                                    {match.status}
                                </span>
                            </div>

                            <div className='grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4'>
                                <div className='flex min-w-0 flex-col items-center rounded-xl border border-border bg-background px-2 py-4 text-center'>
                                    <span className='my-1 size-10 rounded-full border border-border bg-card'></span>
                                    <b className='mt-2 text-base sm:text-xl lg:text-2xl leading-tight wrap-break-word'>
                                        {match.homeTeam}
                                    </b>
                                    <b className='mt-2 text-lg sm:text-xl'>0</b>
                                </div>

                                <div className='flex flex-col items-center gap-1 px-1'>
                                    <span className='text-lg sm:text-2xl font-bold text-muted-foreground'>VS</span>
                                    <span className='text-[11px] sm:text-xs text-center text-muted-foreground'>
                                        {formatDate(match.dateTime)}
                                    </span>
                                </div>

                                <div className='flex min-w-0 flex-col items-center rounded-xl border border-border bg-background px-2 py-4 text-center'>
                                    <span className='my-1 size-10 rounded-full border border-border bg-card'></span>
                                    <b className='mt-2 text-base sm:text-xl lg:text-2xl leading-tight wrap-break-word'>
                                        {match.awayTeam}
                                    </b>
                                    <b className='mt-2 text-lg sm:text-xl'>0</b>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs sm:text-sm'>
                                <div className='rounded-xl border border-border bg-background p-3'>
                                    <p className='text-muted-foreground'>Venue</p>
                                    <p className='mt-1 font-medium wrap-break-word'>{match.venue}</p>
                                </div>
                                <div className='rounded-xl border border-border bg-background p-3'>
                                    <p className='text-muted-foreground'>Home Form</p>
                                    <p className='mt-1 font-medium tracking-[0.2em]'>{match.statistics.homeTeamRecentForm}</p>
                                </div>
                                <div className='rounded-xl border border-border bg-background p-3'>
                                    <p className='text-muted-foreground'>Away Form</p>
                                    <p className='mt-1 font-medium tracking-[0.2em]'>{match.statistics.awayTeamRecentForm}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className='w-full rounded-2xl border bg-card p-4 sm:p-5 flex flex-col gap-4'>
                        <div className='w-full flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                            {tabConfig.map((tab) => (
                                <button
                                    key={tab.key}
                                    type='button'
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`shrink-0 rounded-lg border px-3 py-2 text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-background hover:bg-muted'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className='flex flex-col gap-5 text-sm'>
                            {marketGroups.map((group) => {
                                if (Object.keys(group.values).length === 0) return null

                                if (group.key === 'handicap') {
                                    return (
                                        <div key={group.key} className='space-y-3'>
                                            <h3 className='text-base font-medium'>{group.title}</h3>
                                            <div className='flex flex-col gap-2'>
                                                <div className='grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 px-1 text-center text-xs text-muted-foreground'>
                                                    <span className='text-left font-medium'>{match.homeTeam}</span>
                                                    <span className='px-3'>Line</span>
                                                    <span className='text-right font-medium'>{match.awayTeam}</span>
                                                </div>
                                                {handicapLines.map(({ line, home, away }) => (
                                                    <div key={line} className='grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2'>
                                                        {renderSelectionButton(group.title, home, group.values[home], home.replace('home ', ''))}
                                                        <span className='w-12 text-center text-xs text-muted-foreground'>{line}</span>
                                                        {renderSelectionButton(group.title, away, group.values[away], away.replace('away ', ''))}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }

                                if (group.key === 'goals') {
                                    const overs = Object.entries(group.values).filter(([option]) => option.toLowerCase().includes('over'))
                                    const unders = Object.entries(group.values).filter(([option]) => option.toLowerCase().includes('under'))

                                    return (
                                        <div key={group.key} className='space-y-3'>
                                            <h3 className='text-base font-medium'>{group.title}</h3>
                                            <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
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

                                return (
                                    <div key={group.key} className='space-y-3'>
                                        <h3 className='text-base font-medium'>{group.title}</h3>
                                        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'>
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

                <div className='hidden shrink-0 self-start sticky top-4 lg:block lg:w-80 xl:w-96'>
                    <BettingSlip />
                </div>
            </Wrapper>
        </div>
    )
}
