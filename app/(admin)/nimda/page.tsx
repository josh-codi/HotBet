'use client'
import Wrapper from '@/components/Wrapper'
import routes from '@/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const tabs = [
    {
        key: 'overview',
        label: 'Overview',
        link: routes.admin.index
    },
    {
        key: 'users',
        label: 'Users',
        link: routes.admin.users
    },
    {
        key: 'paid-users',
        label: 'Paid Users',
        link: routes.admin["paid-users"]
    },
    {
        key: 'matches',
        label: 'Matches',
        link: routes.admin.matches.index
    },
    {
        key: 'funds',
        label: 'Funds',
        link: routes.admin.funds.index
    }
]

const users = [
    { id: 'USR-1001', name: 'Joshua Odame', email: 'joshua@hotbet.com', status: 'active', joined: '2026-03-01' },
    { id: 'USR-1002', name: 'Ama Mensah', email: 'ama@hotbet.com', status: 'active', joined: '2026-03-03' },
    { id: 'USR-1003', name: 'Kojo Owusu', email: 'kojo@hotbet.com', status: 'suspended', joined: '2026-03-05' },
    { id: 'USR-1004', name: 'Nana Addo', email: 'nana@hotbet.com', status: 'active', joined: '2026-03-07' }
]

const paidUsers = [
    { id: 'USR-1001', name: 'Joshua Odame', plan: 'VIP', deposit: 'GH¢ 2,400.00', expiry: '2026-04-01' },
    { id: 'USR-1002', name: 'Ama Mensah', plan: 'Pro', deposit: 'GH¢ 1,250.00', expiry: '2026-03-28' }
]

const matches = [
    { id: 1, fixture: 'Manchester United vs Chelsea', league: 'Premier League', time: '2026-04-12 17:30', status: 'scheduled' },
    { id: 2, fixture: 'Liverpool vs Arsenal', league: 'Premier League', time: '2026-04-13 19:00', status: 'scheduled' },
    { id: 3, fixture: 'Barcelona vs Atletico Madrid', league: 'La Liga', time: '2026-04-14 20:00', status: 'scheduled' }
]

const funds = {
    totalBalance: 'GH¢ 63,533.00',
    walletInflow: 'GH¢ 18,200.00',
    walletOutflow: 'GH¢ 4,930.00',
    pendingWithdrawals: 'GH¢ 1,280.00'
}

export default function AdminDashboard() {
    const pathname = usePathname()
    const activeUsers = users.filter((user) => user.status === 'active').length
    const suspendedUsers = users.filter((user) => user.status === 'suspended').length
    const paidUserRate = users.length ? Math.round((paidUsers.length / users.length) * 100) : 0

    const userStats = [
        { label: 'Total Users', value: users.length },
        { label: 'Active Users', value: activeUsers },
        { label: 'Suspended Users', value: suspendedUsers },
        { label: 'Paid Users', value: paidUsers.length },
        { label: 'Paid User Rate', value: `${paidUserRate}%` }
    ]

    return (
        <div className='w-full min-h-svh flex flex-col items-center py-4 sm:py-6'>
            <Wrapper className='w-full max-w-6xl gap-4'>
                <section className="w-full">
                    <div className="flex flex-col">
                        <b className='text-xl md:text-2xl'>Admin Dashboard</b>
                        <p className='text-sm text-muted-foreground mt-1'>
                            Monitor platform activity and manage users, matches, and funds.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center overflow-x-auto text-nowrap gap-2">
                        {tabs.map((tab) => (
                            <Link href={tab.link}
                                key={tab.key}
                                type='button'
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${pathname === tab.link
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-white/5 dark:text-white/80 hover:bg-white/10 hover:text-primary'
                                    }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <article className='flex flex-col justify-between rounded-2xl border bg-gray-100 dark:bg-background p-4'>
                        <div className="w-full flex items-center justify-between mb-6">
                            <h2 className='text-lg md:text-xl font-bold'>Funds Overview</h2>
                            <Link href={routes.admin.funds.index} className="text-primary p-0 text-sm">View Details</Link>
                        </div>

                        <div className="flex flex-col gap-3.5 text-nowrap text-sm">
                            {Object.entries(funds).map(([key, value]) => (
                                <span key={key} className="w-full flex items-center justify-between gap-2">
                                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                    <span className="border-b border-dashed w-full"></span>
                                    <span className='text-muted-foreground'>{value}</span>
                                </span>
                            ))}
                        </div>
                    </article>
                    <article className='flex flex-col justify-between rounded-2xl border bg-gray-100 dark:bg-background p-4'>
                        <div className="w-full flex items-center justify-between mb-6">
                            <h2 className='text-lg md:text-xl font-bold'>Users Overview</h2>
                            <Link href={routes.admin.users} className="text-primary p-0 text-sm">View All</Link>
                        </div>

                        <div className="flex flex-col gap-3.5 text-nowrap text-sm">
                            {userStats.map((stat) => (
                                <span key={stat.label} className="w-full flex items-center justify-between gap-2">
                                    <span>{stat.label}</span>
                                    <span className="border-b border-dashed w-full"></span>
                                    <span className='text-muted-foreground'>{stat.value}</span>
                                </span>
                            ))}
                        </div>
                    </article>
                    <article className='flex flex-col justify-between rounded-2xl border bg-gray-100 dark:bg-background p-4'>
                        <div className="w-full flex items-center justify-between mb-6">
                            <h2 className='text-lg md:text-xl font-bold'>Recent Matches</h2>
                            <Link href={routes.admin.matches.index} className="text-primary p-0 text-sm">View All</Link>
                        </div>

                        <div className="flex flex-col gap-3.5 text-nowrap text-sm">
                            {matches.map((match) => (
                                <span key={match.id} className="w-full flex items-center justify-between gap-2">
                                    <span>{match.fixture}</span>
                                    <span className="border-b border-dashed w-full"></span>
                                    <span className='text-muted-foreground'>{match.time}</span>
                                </span>
                            ))}
                        </div>
                    </article>
                </section>
            </Wrapper>
        </div>
    )
}