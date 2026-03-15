'use client'

import React from 'react'
import matches from '../constants/matches'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import routes from '@/routes'
import { buildSelectionId, useBettingSlipStore } from '../lib/betting-slip-store'

type props = {
    match: typeof matches[0]
    admin?: boolean
}

export default function MatchListing({ match, admin }: props) {
    const selections = useBettingSlipStore((state) => state.selections)
    const toggleSelection = useBettingSlipStore((state) => state.toggleSelection)

    const options = [
        { label: '1', option: 'Home Win', odd: match.odds.matchResult.homeWin, icon: null },
        { label: 'X', option: 'Draw', odd: match.odds.matchResult.draw, icon: <Plus className='rotate-45 size-4' /> },
        { label: '2', option: 'Away Win', odd: match.odds.matchResult.awayWin, icon: null }
    ]

    return (
        <div className='w-full flex flex-col border-b py-2'>
            {admin ? (
                <div className="w-full flex flex-col gap-1">
                    <span className="w-full flex items-center justify-between text-sm">
                        <span className='sm:text-sm text-xs'>{match.dateTime} <span className={`ml-2 ${match.status === 'live' ? 'text-green-500' : match.status === 'pending' ? 'text-yellow-500' : 'text-gray-500 border p-1 px-2.5'}`}>{match.status}</span></span>
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
                        <span className='font-semibold text-nowrap'>2 : 3</span>
                    </div>
                </div>
            ) : <>
                <Link href={routes.match.index(match.id)} className="w-full flex flex-col gap-1">
                    <span className="w-full flex items-center justify-between text-xs sm:text-sm">
                        <span>{match.dateTime}</span>
                        <span className='text-gray-500'>{match.league}</span>
                    </span>
                    <div className="flex items-center justify-between w-full">
                        <span className="w-full flex flex-col text-sm sm:text-base md:text-lg font-medium md:font-bold my-2">
                            <span className='leading-tight'>{match.homeTeam}</span>
                            <span className='leading-tight'>{match.awayTeam}</span>
                        </span>
                            {match.status !== 'pending' ? <b className="text-nowrap">0 : 0</b> : <span className='text-gray-500 text-sm font-semibold'>PENDING</span>}
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
