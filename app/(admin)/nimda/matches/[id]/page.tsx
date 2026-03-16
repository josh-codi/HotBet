'use client';

import GoBack from '@/components/GoBack';
import Wrapper from '@/components/Wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import matches from '@/constants/matches';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'

type Match = typeof matches[number]
type ScoreHalf = '1st half' | '2nd half'
type AdminMatchStatus = Match['status'] | 'suspended'

type ScoreUpdate = {
    id: number
    minute: number
    half: ScoreHalf
    homeScore: number
    awayScore: number
    note: string
    createdAt: string
}

const HALF_OPTIONS: ScoreHalf[] = ['1st half', '2nd half']

const prettyMarket = (market: string) =>
    market
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
        .trim()

const prettySelection = (selection: string) =>
    selection
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase())
        .trim()

const flattenOdds = (match: Match) => {
    const rows: { market: string; selection: string; value: number }[] = []

    Object.entries(match.odds).forEach(([market, values]) => {
        Object.entries(values).forEach(([selection, value]) => {
            rows.push({ market, selection, value })
        })
    })

    return rows
}

export default function AdminMatchDetail() {
    const params = useParams();
    const match = matches.find((m) => m.id === Number(params.id));

    const [oddsValues, setOddsValues] = useState<Record<string, string>>(() => {
        if (!match) {
            return {}
        }

        return flattenOdds(match).reduce<Record<string, string>>((acc, item) => {
            acc[`${item.market}.${item.selection}`] = String(item.value)
            return acc
        }, {})
    })

    const [homeScore, setHomeScore] = useState(0)
    const [awayScore, setAwayScore] = useState(0)
    const [minute, setMinute] = useState(0)
    const [half, setHalf] = useState<ScoreHalf>('1st half')
    const [note, setNote] = useState('')
    const [updates, setUpdates] = useState<ScoreUpdate[]>([])
    const [saveMessage, setSaveMessage] = useState('')
    const [matchStatus, setMatchStatus] = useState<AdminMatchStatus>(match?.status ?? 'pending')

    const groupedOdds = useMemo(() => {
        if (!match) {
            return []
        }

        const grouped = new Map<string, { selection: string; value: number }[]>()

        flattenOdds(match).forEach((item) => {
            const list = grouped.get(item.market) ?? []
            list.push({ selection: item.selection, value: item.value })
            grouped.set(item.market, list)
        })

        return Array.from(grouped.entries())
    }, [match])

    if (!match) {
        return (
            <div className='w-full flex flex-col items-center gap-4 py-8'>
                <Wrapper className='items-start gap-3 px-4'>
                    <h1 className='text-xl font-semibold'>Match Not Found</h1>
                    <p className='text-sm text-muted-foreground'>
                        The match you requested does not exist.
                    </p>
                    <Button asChild>
                        <Link href='/nimda/matches'>Back to all matches</Link>
                    </Button>
                </Wrapper>
            </div>
        )
    }

    const handleOddChange = (key: string, value: string) => {
        setOddsValues((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const handleSaveOdds = () => {
        setSaveMessage('Odds updated locally. Connect this action to your API to persist changes.')
    }

    const addScoreUpdate = () => {
        if (minute < 0 || minute > 90) {
            setSaveMessage('Minute must be between 0 and 90.')
            return
        }

        if (homeScore < 0 || awayScore < 0) {
            setSaveMessage('Scores cannot be negative.')
            return
        }

        const payload: ScoreUpdate = {
            id: Date.now(),
            minute,
            half,
            homeScore,
            awayScore,
            note: note.trim(),
            createdAt: new Date().toISOString(),
        }

        setUpdates((prev) => [payload, ...prev])
        setSaveMessage(`Score update added at ${minute}' (${half}).`)
        setNote('')
    }

    const suspendMatch = () => {
        if (matchStatus === 'finished') {
            setSaveMessage('Cannot suspend a closed match.')
            return
        }

        setMatchStatus('suspended')
        setSaveMessage('Match suspended successfully.')
    }

    const closeMatch = () => {
        setMatchStatus('finished')
        setSaveMessage('Match closed successfully.')
    }

    const statusText = matchStatus === 'finished'
        ? 'Closed'
        : matchStatus === 'suspended'
            ? 'Suspended'
            : matchStatus === 'live'
                ? 'Live'
                : 'Pending'

    const statusTone = matchStatus === 'finished'
        ? 'text-green-700 bg-green-100 border-green-200'
        : matchStatus === 'suspended'
            ? 'text-amber-700 bg-amber-100 border-amber-200'
            : matchStatus === 'live'
                ? 'text-blue-700 bg-blue-100 border-blue-200'
                : 'text-zinc-700 bg-zinc-100 border-zinc-200'

    return (
        <div className='w-full flex flex-col items-center gap-6 py-4 sm:py-6'>
            <Wrapper className='w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-0'>
                <GoBack />
                <div className='w-full flex flex-col gap-1'>
                    <p className='text-xs sm:text-sm text-muted-foreground'>{match.league}</p>
                    <h1 className='text-sm sm:text-xl lg:text-2xl font-medium sm:font-semibold leading-tight wrap-break-word'>
                        {match.homeTeam} vs {match.awayTeam}
                    </h1>
                    <p className='text-xs sm:text-sm text-muted-foreground wrap-break-word'>
                        {new Date(match.dateTime).toLocaleString()}
                    </p>
                </div>

                <section className='w-full rounded-md border p-3 sm:p-4 space-y-4 mt-4 sm:mt-5'>
                    <div className='flex items-center justify-between gap-2'>
                        <h2 className='text-sm font-medium text-muted-foreground'>Current Match Status</h2>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone}`}>
                            {statusText}
                        </span>
                    </div>
                    <div>
                        <h2 className='text-lg font-medium'>Update Scores</h2>
                        <p className='text-xs text-muted-foreground'>
                            Tag each update by half and minute (0-90).
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                        <label className='flex flex-col gap-1 text-xs'>
                            <span className='text-muted-foreground'>{match.homeTeam} score</span>
                            <Input
                                type='number'
                                min={0}
                                step='1'
                                value={homeScore}
                                onChange={(event) => setHomeScore(Number(event.target.value))}
                                className='h-9 rounded-md border bg-background px-2 text-sm'
                            />
                        </label>

                        <label className='flex flex-col gap-1 text-xs'>
                            <span className='text-muted-foreground'>{match.awayTeam} score</span>
                            <Input
                                type='number'
                                min={0}
                                step='1'
                                value={awayScore}
                                onChange={(event) => setAwayScore(Number(event.target.value))}
                                className='h-9 rounded-md border bg-background px-2 text-sm'
                            />
                        </label>

                        <label className='flex flex-col gap-1 text-xs'>
                            <span className='text-muted-foreground'>Half tag</span>
                            <Select
                                value={half}
                                onValueChange={(value) => setHalf(value as ScoreHalf)}
                            >
                                <SelectTrigger className='h-9'>
                                    <SelectValue placeholder='Select half' />
                                </SelectTrigger>
                                <SelectContent>
                                    {HALF_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </label>

                        <label className='flex flex-col gap-1 text-xs'>
                            <span className='text-muted-foreground'>Minute (0-90)</span>
                            <Input
                                type='number'
                                min={0}
                                max={90}
                                step='1'
                                value={minute}
                                onChange={(event) => setMinute(Number(event.target.value))}
                                className='h-9 rounded-md border bg-background px-2 text-sm'
                            />
                        </label>
                    </div>

                    <label className='flex flex-col gap-1 text-xs'>
                        <span className='text-muted-foreground'>Note (optional)</span>
                        <Input
                            type='text'
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder='e.g. Penalty converted'
                            className='h-9 rounded-md border bg-background px-2 text-sm'
                        />
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        <Button onClick={addScoreUpdate} className='w-full sm:w-auto'>Add score update</Button>
                    </div>

                    <div className='rounded-md border'>
                        <div className='px-3 py-2 border-b text-sm font-medium'>Update History</div>
                        {updates.length === 0 ? (
                            <p className='px-3 py-3 text-sm text-muted-foreground'>No score updates yet.</p>
                        ) : (
                            <ul className='divide-y'>
                                {updates.map((update) => (
                                    <li key={update.id} className='px-3 py-2 text-sm'>
                                        <div className='font-medium wrap-break-word'>
                                            {match.homeTeam} {update.homeScore} - {update.awayScore} {match.awayTeam}
                                        </div>
                                        <div className='text-xs text-muted-foreground wrap-break-word'>
                                            {update.half} • {update.minute}&apos; • {new Date(update.createdAt).toLocaleTimeString()}
                                        </div>
                                        {update.note && (
                                            <p className='text-xs mt-1'>{update.note}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                {saveMessage && (
                    <p className='w-full text-sm text-muted-foreground mt-2'>{saveMessage}</p>
                )}


                <section className='w-full rounded-md border p-3 sm:p-4 mt-4 sm:mt-5 space-y-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                        <div>
                            <h2 className='text-lg font-medium'>Update Odds</h2>
                            <p className='text-xs text-muted-foreground'>
                                Edit any market and save changes.
                            </p>
                        </div>
                        <Button onClick={handleSaveOdds} className='w-full sm:w-auto'>Save odds</Button>
                    </div>

                    <div className='space-y-4'>
                        {groupedOdds.map(([market, selections]) => (
                            <div key={market} className='rounded-md border p-2.5 sm:p-3'>
                                <h3 className='font-medium text-sm'>{prettyMarket(market)}</h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3 mt-3'>
                                    {selections.map((selection) => {
                                        const key = `${market}.${selection.selection}`

                                        return (
                                            <label key={key} className='flex flex-col gap-1 text-xs'>
                                                <span className='text-muted-foreground'>
                                                    {prettySelection(selection.selection)}
                                                </span>
                                                <Input
                                                    type='number'
                                                    min={1.05}
                                                    step='0.01'
                                                    value={oddsValues[key] ?? String(selection.value)}
                                                    onChange={(event) => handleOddChange(key, event.target.value)}
                                                    className='h-9 rounded-md border bg-background px-2 text-sm'
                                                />
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className='flex flex-col sm:flex-row gap-2 py-4 w-full'>
                    <Button
                        variant='outline'
                        onClick={suspendMatch}
                        disabled={matchStatus === 'suspended' || matchStatus === 'finished'}
                        className='w-full sm:w-auto'
                    >
                        Suspend match
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={closeMatch}
                        disabled={matchStatus === 'finished'}
                        className='w-full sm:w-auto'
                    >
                        Close match
                    </Button>
                </div>

            </Wrapper>

        </div>
    )
}
