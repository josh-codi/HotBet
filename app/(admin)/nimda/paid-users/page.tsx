'use client';

import GoBack from '@/components/GoBack';
import Wrapper from '@/components/Wrapper';
import React from 'react'

const paidUsers = [
    { id: 'USR-1001', name: 'Joshua Odame', plan: 'VIP', deposit: 2400, expiry: '2026-04-01', status: 'active' },
    { id: 'USR-1002', name: 'Ama Mensah', plan: 'Pro', deposit: 1250, expiry: '2026-03-28', status: 'active' },
    { id: 'USR-1005', name: 'Michael Kusi', plan: 'Pro', deposit: 980, expiry: '2026-03-25', status: 'active' },
    { id: 'USR-1009', name: 'Esi Agyemang', plan: 'VIP', deposit: 3150, expiry: '2026-04-11', status: 'active' }
]

export default function PaidUsers() {
    const totalPaidUsers = paidUsers.length
    const totalDeposits = paidUsers.reduce((sum, item) => sum + item.deposit, 0)

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4'>
                <GoBack />

                <div className='w-full'>
                    <h1 className='text-xl sm:text-2xl font-semibold'>Paid Users</h1>
                    <p className='text-sm text-muted-foreground'>
                        Monitor users on premium plans and upcoming expiries.
                    </p>
                </div>

                <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div className='rounded-lg border p-4'>
                        <p className='text-sm text-muted-foreground'>Total Paid Users</p>
                        <p className='text-2xl font-semibold mt-1'>{totalPaidUsers}</p>
                    </div>
                    <div className='rounded-lg border p-4'>
                        <p className='text-sm text-muted-foreground'>Total Deposits</p>
                        <p className='text-2xl font-semibold mt-1'>{totalDeposits.toFixed(2)}</p>
                    </div>
                </div>

                <section className='w-full rounded-lg border overflow-hidden'>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-muted/40'>
                                <tr className='text-left'>
                                    <th className='px-4 py-3 font-medium'>User</th>
                                    <th className='px-4 py-3 font-medium'>Plan</th>
                                    <th className='px-4 py-3 font-medium'>Deposit</th>
                                    <th className='px-4 py-3 font-medium'>Expiry</th>
                                    <th className='px-4 py-3 font-medium'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paidUsers.map((user) => (
                                    <tr key={user.id} className='border-t'>
                                        <td className='px-4 py-3'>
                                            <p className='font-medium'>{user.name}</p>
                                            <p className='text-xs text-muted-foreground'>{user.id}</p>
                                        </td>
                                        <td className='px-4 py-3'>{user.plan}</td>
                                        <td className='px-4 py-3'>{user.deposit.toFixed(2)}</td>
                                        <td className='px-4 py-3'>{user.expiry}</td>
                                        <td className='px-4 py-3'>
                                            <span className='inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700'>
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </Wrapper>
        </div>
    )
}
