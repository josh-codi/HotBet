'use client'

import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import React from 'react'

const MIN = 2
const MAX = 75000

const providers = [
    { value: 'MTN', label: 'MTN Mobile Money', prefix: '+233' },
    { value: 'Vodafone', label: 'Vodafone Cash', prefix: '+233 ' },
    { value: 'AirtelTigo', label: 'AirtelTigo Money', prefix: '+233 ' },
]

const rules = [
    'Your account must be verified before you can make a withdrawal.',
    'Minimum withdrawal is GH¢ 2.00. Maximum per transaction is GH¢ 75,000.00.',
    'You must have placed at least one bet using your deposited funds before withdrawing.',
    'Bonus funds cannot be withdrawn until all wagering requirements have been met.',
    'The mobile money number must be registered in your own name and match your HotBet account.',
    'Withdrawals are processed within 24 hours. Processing may take longer on weekends and public holidays.',
    'HotBet reserves the right to request identity verification documents before processing any withdrawal.',
    'Withdrawals to accounts that did not fund the original deposit may be declined.',
]

export default function WithdrawalPage() {
    const [provider, setProvider] = React.useState('MTN')
    const [phone, setPhone] = React.useState('')
    const [amount, setAmount] = React.useState('')
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const selectedProvider = providers.find((p) => p.value === provider)!

    const handleWithdraw = (event: React.FormEvent) => {
        event.preventDefault()
        const numericAmount = Number(amount)

        if (!phone.trim()) {
            setMessage({ type: 'error', text: 'Please enter your mobile number.' })
            return
        }

        if (!Number.isFinite(numericAmount) || numericAmount < MIN) {
            setMessage({ type: 'error', text: `Minimum withdrawal amount is GH¢ ${MIN}.00.` })
            return
        }

        if (numericAmount > MAX) {
            setMessage({ type: 'error', text: `Maximum withdrawal per transaction is GH¢ ${MAX.toLocaleString()}.00.` })
            return
        }

        setMessage({
            type: 'success',
            text: `Withdrawal of GH¢ ${numericAmount.toFixed(2)} to ${provider} (${phone}) has been submitted. You will receive your funds within 24 hours.`,
        })
    }

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='md:gap-4 flex-row items-start'>
                <div className='flex flex-col w-full'>
                    <GoBack />
                    <div className='w-full mb-4'>
                        <h1 className='text-xl sm:text-2xl font-semibold'>Withdraw</h1>
                        <p className='text-xs sm:text-sm text-muted-foreground'>
                            Making a withdrawal is free and easy. Just enter these details and then click WITHDRAW.
                        </p>
                    </div>

                    <section className='w-full rounded-lg border p-4 sm:p-5 space-y-5'>
                        <form onSubmit={handleWithdraw} className='space-y-4'>
                            <div className='flex flex-col gap-1 text-sm'>
                                <span className='text-muted-foreground font-medium'>Withdrawal Option</span>
                                <Select value={provider} onValueChange={setProvider}>
                                    <SelectTrigger className='h-10'>
                                        <SelectValue placeholder='Select provider' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {providers.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <label className='flex flex-col gap-1 text-sm'>
                                <span className='text-muted-foreground'>Your mobile number</span>
                                <div className='flex items-center gap-2'>
                                    <span className='h-10 flex items-center px-3 rounded-md border bg-muted text-sm text-muted-foreground shrink-0'>
                                        {selectedProvider.prefix}
                                    </span>
                                    <Input
                                        type='tel'
                                        placeholder='XXXXXXX'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className='h-10'
                                    />
                                </div>
                            </label>

                            <label className='flex flex-col gap-1 text-sm'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-muted-foreground'>Amount</span>
                                    <span className='text-xs text-green-600 font-semibold'>FREE</span>
                                </div>
                                <div className='relative'>
                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium select-none'>
                                        GH¢
                                    </span>
                                    <Input
                                        type='number'
                                        min={MIN}
                                        max={MAX}
                                        step='0.01'
                                        placeholder='0.00'
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className='h-10 pl-12'
                                    />
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                    Min: {MIN.toLocaleString()}, Max: {MAX.toLocaleString()}
                                </span>
                            </label>

                            {message && (
                                <div className={`flex items-start gap-2 rounded-md border p-3 text-sm ${message.type === 'success'
                                        ? 'border-green-200 bg-green-50 text-green-700'
                                        : 'border-red-200 bg-red-50 text-red-700'
                                    }`}>
                                    {message.type === 'success'
                                        ? <CheckCircle2 className='size-4 shrink-0 mt-0.5' />
                                        : <AlertTriangle className='size-4 shrink-0 mt-0.5' />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <Button type='submit' className='w-full sm:w-auto uppercase tracking-wide'>
                                Withdraw
                            </Button>
                        </form>

                        <hr />

                        <div className='space-y-3'>
                            <div className='flex items-center gap-2 text-sm font-medium'>
                                <Info className='size-4 text-muted-foreground' />
                                <span>Withdrawal Rules</span>
                            </div>
                            <ul className='space-y-2'>
                                {rules.map((rule, i) => (
                                    <li key={i} className='flex items-start gap-2 text-xs text-muted-foreground'>
                                        <span className='mt-0.5 shrink-0 size-4 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground'>
                                            {i + 1}
                                        </span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>
                <BettingSlip />
            </Wrapper>
        </div>
    )
}
