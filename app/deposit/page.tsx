'use client'

import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'

const quickAmounts = [20, 50, 100, 200]

export default function DepositPage() {
    const [amount, setAmount] = React.useState('50')
    const [method, setMethod] = React.useState('Mobile Money')
    const [message, setMessage] = React.useState('')

    const handleDeposit = (event: React.FormEvent) => {
        event.preventDefault()
        const numericAmount = Number(amount)

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setMessage('Enter a valid amount greater than 0.')
            return
        }

        setMessage(`Deposit request for ${numericAmount.toFixed(2)} via ${method} has been submitted.`)
    }

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4 flex-row items-start'>
                <div className="flex flex-col w-full">
                    <GoBack/>
                    <div className='w-full mb-4'>
                        <h1 className='text-xl sm:text-2xl font-semibold'>Deposit</h1>
                        <p className='text-sm text-muted-foreground'>
                            Fund your wallet securely and keep betting without interruption.
                        </p>
                    </div>

                    <section className='w-full rounded-lg border p-4 sm:p-5'>
                        <p className="text-sm text-muted-foreground mb-5">
                            Easily fund your HotBet wallet using your preferred payment method. Enter the amount you want to deposit below to continue.
                            <span className='text-yellow-600'>Please make sure your payment account is active and has enough funds before submitting your deposit.</span>
                        </p>
                        <form onSubmit={handleDeposit} className='space-y-4'>
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                                {quickAmounts.map((quickAmount) => (
                                    <Button
                                        key={quickAmount}
                                        type='button'
                                        variant='outline'
                                        onClick={() => setAmount(String(quickAmount))}
                                    >
                                        +{quickAmount} GHS
                                    </Button>
                                ))}
                            </div>

                            <label className='flex flex-col gap-1 text-sm'>
                                <span className='text-muted-foreground'>Amount</span>
                                <Input
                                    type='number'
                                    min={1}
                                    step='0.01'
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    className='h-10 rounded-md border bg-background px-3 text-sm'
                                />
                            </label>

                            <label className='flex flex-col gap-1 text-sm'>
                                <span className='text-muted-foreground'>Payment Method</span>
                                <Select value={method} onValueChange={setMethod}>
                                    <SelectTrigger className='h-10'>
                                        <SelectValue placeholder='Select payment method' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Mobile Money'>Mobile Money</SelectItem>
                                        <SelectItem value='Bank Card'>Bank Card</SelectItem>
                                        <SelectItem value='Bank Transfer'>Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </label>

                            <Button type='submit' className='w-full sm:w-auto'>
                                Continue Deposit
                            </Button>

                            {message && <p className='text-sm text-muted-foreground'>{message}</p>}
                            <br />
                            <span className="text-sm">
                                What happens next? Confirm deposit request to <span className='text-yellow-600'>on your phone</span> to complete the deposit. Note: Make sure any pop-up blocker is disabled.
                            </span>
                        </form>
                    </section>
                </div>
                <BettingSlip/>
            </Wrapper>
        </div>
    )
}
