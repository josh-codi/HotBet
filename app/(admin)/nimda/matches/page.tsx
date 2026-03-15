'use client';

import GoBack from '@/components/GoBack';
import MatchListing from '@/components/MatchListing';
import { Button } from '@/components/ui/button';
import Wrapper from '@/components/Wrapper';
import matches from '@/constants/matches';
import routes from '@/routes';
import Link from 'next/link';
import React from 'react'

export default function AdminMatchesPage() {
    return (
        <div className='w-full flex flex-col items-center gap-5'>
            <Wrapper>
                <div className="w-full flex flex-col py-4 items-start">
                    <GoBack/>
                    <b className="text-lg font-medium">All Matches</b>
                    <p className="text-sm text-gray-500">Manage all matches, add new matches, and update existing matches.</p>

                    <div className="flex flex-col py-4 items-center gap-4">
                        <Link href={routes.admin.matches.new}><Button>New match</Button></Link>
                    </div>
                </div>

                <section className="flex flex-col gap-4 w-full border-t pt-2">
                    {
                        matches.map((match) => {
                            return <MatchListing admin key={match.id} match={match} />
                        })
                    }
                </section>
            </Wrapper>
        </div>
    )
}
