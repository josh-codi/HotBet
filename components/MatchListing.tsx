'use client'

import React from 'react'
import matches from '../constants/matches'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import routes from '@/routes'
import { buildSelectionId, useBettingSlipStore } from '../lib/betting-slip-store'
import Tag from './Tag'

type props = {
    match: typeof matches[0]
    admin?: boolean
}

export default function MatchListing({ match, admin }: props) {
    const selections = useBettingSlipStore((state) => state.selections)
    const toggleSelection = useBettingSlipStore((state) => state.toggleSelection)

    const options = [
        { label: '1', option: 'Home', odd: match.odds.matchResult.homeWin, icon: null },
        { label: 'X', option: 'Draw', odd: match.odds.matchResult.draw, icon: <Plus className='rotate-45 size-4' /> },
        { label: '2', option: 'Away', odd: match.odds.matchResult.awayWin, icon: null }
    ]

    return (
        <div className='w-full flex flex-col border-b py-2'>
            {admin ? (
                <div className="w-full flex flex-col gap-1">
                    <span className="w-full flex items-center justify-between text-sm">
                        <span className='sm:text-sm text-xs flex items-center gap-2'>
                            <span>{match.dateTime}</span>
                            <Tag status={match.status} />
                        </span>
                        <div className="flex items-center gap-2">
                            <Link href={routes.admin.matches.match(match.id)}><Button variant='outline' size='xs'>Edit</Button></Link>
                            <Button variant='destructive' size='xs'>Close</Button>
                        </div>
                    </span>
                    <div className="w-full flex items-center justify-between">
                        <span className="w-full flex flex-col text-sm sm:text-base md:text-lg font-medium md:font-bold my-2">
                            <span className='leading-tight'>{match.homeTeam}</span>
                            <span className='leading-tight'>{match.awayTeam}</span>
                        </span>
                    </div>
                </div>
            ) : <>
                <Link href={routes.match.index(match.id)} className="w-full flex flex-col gap-1">
                    <span className="w-full flex items-center justify-between text-xs sm:text-sm">
                        <span>{match.dateTime}</span>
                        <span className='flex items-center gap-2'>
                            <span className='text-gray-500'>{match.league}</span>
                            <Tag status={match.status} />
                        </span>
                    </span>
                    <div className="flex items-center justify-between w-full">
                        <span className="w-full flex flex-col text-sm sm:text-base md:text-lg font-medium md:font-bold my-2">
                            <span className='leading-tight'>{match.homeTeam}</span>
                            <span className='leading-tight'>{match.awayTeam}</span>
                        </span>
                    </div>
                </Link>
                <div className="w-full grid grid-cols-3 gap-2">
                    {options.map((item) => {
                        const selectionId = buildSelectionId(match.id, 'Match Result', item.option)
                        const isSelected = selections.some((selection) => selection.id === selectionId)

                        return (
                            <Button
                                key={selectionId}
                                type='button'
                                variant={isSelected ? 'default' : 'secondary'}
                                className='h-10'
                                onClick={() =>
                                    toggleSelection({
                                        id: selectionId,
                                        matchId: match.id,
                                        homeTeam: match.homeTeam,
                                        awayTeam: match.awayTeam,
                                        market: 'Match Result',
                                        option: item.option,
                                        odd: item.odd
                                    })
                                }
                            >
                                {item.icon ?? item.label}
                                <span className="w-full text-center">{item.odd.toFixed(2)}</span>
                            </Button>
                        )
                    })}
                </div>
            </>
            }
        </div>
    )
}
