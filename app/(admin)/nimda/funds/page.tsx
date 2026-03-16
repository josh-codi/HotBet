'use client';

import React from 'react'
import { ArrowDownCircle, ArrowUpCircle, CircleDollarSign } from 'lucide-react'
import Wrapper from '@/components/Wrapper'
import GoBack from '@/components/GoBack';

const transactions = [
    {
        id: 'TXN-1001',
        type: 'Payout',
        date: '2024-06-01',
        amount: '+$500.00',
        amountClass: 'text-emerald-700',
        status: 'Completed',
        statusClass: 'text-emerald-700',
        direction: 'up'
    },
    {
        id: 'TXN-1002',
        type: 'Sale',
        date: '2024-06-02',
        amount: '+$150.00',
        amountClass: 'text-emerald-700',
        status: 'Completed',
        statusClass: 'text-emerald-700',
        direction: 'down'
    },
    {
        id: 'TXN-1003',
        type: 'Refund',
        date: '2024-06-03',
        amount: '-$50.00',
        amountClass: 'text-red-600',
        status: 'Refunded',
        statusClass: 'text-red-600',
        direction: 'up'
    },
    {
        id: 'TXN-1004',
        type: 'Sale',
        date: '2024-06-04',
        amount: '+$220.00',
        amountClass: 'text-emerald-700',
        status: 'Pending',
        statusClass: 'text-amber-600',
        direction: 'down'
    }
]

export default function FundPage() {
    return (
        <div className='w-full min-h-svh flex flex-col items-center bg-background text-foreground px-4 py-6 md:px-8'>
            <Wrapper className='gap-8 items-start'>
                <GoBack />
                <div className='w-full'>
                    <h1 className='text-3xl font-extrabold tracking-tight'>Your Funds</h1>
                    <p className='mt-2 text-slate-600'>
                        View your available balance, pending payouts, and transaction history. Withdraw your funds anytime.
                    </p>
                </div>

                <section className='w-full flex gap-4'>
                    <article className='rounded-3xl border p-3 flex items-center gap-4'>
                        <CircleDollarSign className='size-5 text-[#8a5a3b]' />
                        <div>
                            <p className='text-sm text-slate-500'>Available Balance</p>
                            <p className='text-lg font-extrabold text-[#8a5a3b]'>$1250.75</p>
                        </div>
                    </article>
                    <article className='rounded-3xl border p-3 flex items-center gap-4'>
                        <CircleDollarSign className='size-5 text-[#8a5a3b]' />
                        <div>
                            <p className='text-sm text-slate-500'>Pending Payouts</p>
                            <p className='text-lg font-extrabold text-[#8a5a3b]'>$320.00</p>
                        </div>
                    </article>
                </section>

                <section className='w-full overflow-hidden rounded-md border border-zinc-200 '>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full text-sm text-left text-nowrap'>
                            <thead className='bg-muted'>
                                <tr className='text-zinc-800 dark:text-zinc-100'>
                                    <th className='px-6 py-4 font-medium'>Transaction ID</th>
                                    <th className='px-6 py-4 font-medium'>Type</th>
                                    <th className='px-6 py-4 font-medium'>Date</th>
                                    <th className='px-6 py-4 font-medium'>Amount</th>
                                    <th className='px-6 py-4 font-medium'>Status</th>
                                    <th className='px-6 py-4 font-medium'>Direction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className='border-t border-zinc-100'>
                                        <td className='px-6 py-5'>{transaction.id}</td>
                                        <td className='px-6 py-5'>{transaction.type}</td>
                                        <td className='px-6 py-5'>{transaction.date}</td>
                                        <td className={`px-6 py-5 font-semibold ${transaction.amountClass}`}>{transaction.amount}</td>
                                        <td className={`px-6 py-5 font-semibold ${transaction.statusClass}`}>{transaction.status}</td>
                                        <td className='px-6 py-5'>
                                            {transaction.direction === 'up' ? (
                                                <ArrowUpCircle className='size-4 text-red-500' />
                                            ) : (
                                                <ArrowDownCircle className='size-4 text-emerald-500' />
                                            )}
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
