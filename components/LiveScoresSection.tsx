'use client'

import { Loader2, Radio } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type ApiFixture = {
    fixture: {
        id: number
        date: string
        status: {
            long: string
            short: string
            elapsed: number | null
        }
    }
    league: {
        name: string
        country: string
        logo: string
        flag: string | null
    }
    teams: {
        home: { id: number; name: string; logo: string }
        away: { id: number; name: string; logo: string }
    }
    goals: {
        home: number | null
        away: number | null
    }
}

const HALFTIME_STATUSES = ['HT', 'BT', 'ET', 'P']
const FINISHED_STATUSES = ['FT', 'AET', 'PEN']

function statusLabel(fixture: ApiFixture['fixture']) {
    const { short, elapsed } = fixture.status
    if (FINISHED_STATUSES.includes(short)) return 'FT'
    if (HALFTIME_STATUSES.includes(short)) return short
    if (elapsed != null) return `${elapsed}'`
    return short
}

function TeamRow({ name, logo, goals }: { name: string; logo: string; goals: number | null }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
                <Image
                    src={logo}
                    alt={name}
                    width={16}
                    height={16}
                    className="size-4 shrink-0 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                <span className="truncate text-sm font-medium">{name}</span>
            </div>
            <span className="font-bold shrink-0 text-sm">{goals ?? 0}</span>
        </div>
    )
}

export default function LiveScoresSection() {
    const [fixtures, setFixtures] = useState<ApiFixture[]>([])
    const [loading, setLoading] = useState(true)
    const [reason, setReason] = useState<string | null>(null)

    const fetchLive = async () => {
        try {
            const res = await fetch('/api/matches/live')
            if (!res.ok) return
            const data = await res.json()
            setFixtures(data.response ?? [])
            setReason(data.ok ? null : (data.reason ?? 'unknown_error'))
        } catch {
            // silently fail — section just won't render
            setReason('network_error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLive()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                <Loader2 className="size-3 animate-spin" />
                Loading live scores…
            </div>
        )
    }

    if (fixtures.length === 0) {
        if (reason === 'missing_api_key') {
            return (
                <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    Live scores are not connected yet. Add <b>API_FOOTBALL_KEY</b> in your <b>.env.local</b> file and restart dev server.
                </div>
            )
        }

        if (reason === 'upstream_error') {
            return (
                <div className="w-full rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    Live scores API is currently unavailable. Please try again shortly.
                </div>
            )
        }

        return null
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
                <Radio className="size-3.5 text-red-500" />
                <span className="text-sm font-semibold">Live Scores</span>
                <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="ml-auto text-xs text-muted-foreground">{fixtures.length} live</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {fixtures.slice(0, 12).map((f) => {
                    const label = statusLabel(f.fixture)
                    const isFinished = FINISHED_STATUSES.includes(f.fixture.status.short)

                    return (
                        <div
                            key={f.fixture.id}
                            className="shrink-0 flex flex-col gap-2 rounded-xl border bg-card p-3 w-44 sm:w-52"
                        >
                            {/* League + status */}
                            <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1 min-w-0">
                                    {f.league.flag && (
                                        <Image
                                            src={f.league.flag}
                                            alt={f.league.country}
                                            width={14}
                                            height={10}
                                            className="shrink-0 rounded-sm object-cover"
                                        />
                                    )}
                                    <span className="truncate text-[10px] text-muted-foreground">{f.league.name}</span>
                                </div>
                                <span className={`shrink-0 text-[10px] font-semibold ${isFinished ? 'text-muted-foreground' : 'text-red-500'}`}>
                                    {label}
                                </span>
                            </div>

                            {/* Teams + scores */}
                            <div className="flex flex-col gap-1">
                                <TeamRow name={f.teams.home.name} logo={f.teams.home.logo} goals={f.goals.home} />
                                <TeamRow name={f.teams.away.name} logo={f.teams.away.logo} goals={f.goals.away} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
