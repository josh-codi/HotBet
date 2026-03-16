'use client'

import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'
import { useBetsStore } from '@/lib/bets-store'
import routes from '@/routes'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function MePage() {
    const tickets = useBetsStore((state) => state.tickets)
    const pendingCount = tickets.filter((ticket) => ticket.status === 'pending').length

    return (
        <div className='w-full h-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4 flex-row items-start h-full'>
                <section className='w-full h-full rounded-lg border p-4 sm:p-5'>
                    <GoBack/>
                    <div className="flex flex-col">
                        <h1 className='text-xl sm:text-2xl font-semibold'>My Account</h1>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Manage your betting profile and review recent activity.
                        </p>
                        <b className="text-xl my-2">GHS 875.00</b>
                        <div className="flex items-center gap-2">
                            <Link href={routes.deposit.index}><Button className='px-10' size='lg'>Deposit</Button></Link>
                            <Link href={routes.withdrawal.index}><Button className='px-10' variant='outline' size='lg'>Withdraw</Button></Link>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 my-4 p-3 border rounded-lg">
                        <span className="w-full flex items-center justify-between">
                            <span>Email:</span>
                            <span className="text-muted-foreground">
                                user@example.com
                            </span>
                        </span>
                        <span className="w-full flex items-center justify-between">
                            <span>Phone:</span>
                            <span className="text-muted-foreground">
                                +233 24 123 4567
                            </span>
                        </span>
                    </div>
                    <br /><br />
                    <div className="flex flex-col py-3 border-t gap-3">
                        <button className="w-full flex items-center justify-between rounded-lg border h-12 px-3">
                            <div className="flex items-center gap-2">
                                <span>My Bets</span>
                                {pendingCount > 0 && (
                                    <span className="text-xs text-white bg-primary rounded-full px-2 py-0.5">
                                        {pendingCount} pending
                                    </span>
                                )}
                            </div>
                            <span className="text-primary flex items-center gap-1">View all <ChevronRight/></span>
                        </button>
                        <button className="w-full flex items-center justify-between rounded-lg border h-12 px-3">
                            <span>Change Password</span>
                            <ChevronRight className='size-4 text-muted-foreground' />
                        </button>
                    </div>
                </section>
                <BettingSlip/>
            </Wrapper>
        </div>
    )
}
