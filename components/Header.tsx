'use client';
import siteInfo from '@/lib/site-info'
import routes from '@/routes'
import { Menu, UserCircle2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Wrapper from './Wrapper'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import BrandName from './BrandName'
import { useUserStore } from '@/lib/user-store';
import { usePathname } from 'next/navigation';

export default function Header() {
    const path = usePathname()

    return (
        <div className='w-full flex justify-center min-h-14 border-b bg-slate-900 dark:bg-background text-white sticky top-0 z-55'>
            <Wrapper className='flex-row items-center justify-between dark:bg-background lg:px-4'>
                <BrandName className='text-2xl text-primary border w-fit py-1 px-4 text-center rounded-xl' />

                {
                    path.includes('nimda') ? (
                        <div className="flex items-center gap-5 text-sm">
                            <Link href={routes.home} className='text-yellow-600'>Visit Clients</Link>
                            <div className="flex items-center md:ml-4">
                                <Link href={routes.me.index} className='flex items-center gap-1'>
                                    <UserCircle2 className='size-5' /> Me
                                </Link>
                            </div>
                            <Button>Logout</Button>
                        </div>
                    ) : (
                        <div className="flex items-center md:gap-5 text-sm">
                            <Link href={routes.home} className='md:block hidden'>Sports</Link>
                            <Link href={routes.live.index} className='md:block hidden'>Live</Link>
                            <Link href={routes.deposit.index} className='md:block hidden'>Deposit</Link>
                            <Link href={routes.bets.index} className='md:block hidden'>Bets</Link>
                            <p id='account-balance' className='md:hidden'>GHS 0.00</p>
                            <div className="flex items-center md:ml-4">
                                <Link href={routes.me.index} className='flex items-center gap-1'>
                                    <UserCircle2 className='size-5' /> Me
                                </Link>
                            </div>
                            <Link href={routes.auth.login}><Button>Login/Signup</Button></Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className='lg:hidden'>
                                    <Button variant='ghost' size='icon-sm' aria-label='Open menu'>
                                        <Menu className='size-4 sm:size-5' />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end' className='w-44 border-4'>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.home}>Sports</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.live.index}>Live</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.deposit.index}>Deposit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.bets.index}>Bets</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={routes.me.index}>Me</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )
                }
            </Wrapper>
        </div>
    )
}
