"use client"

import GoBack from '@/components/GoBack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Wrapper from '@/components/Wrapper'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function AdminLogin() {
    const [email, setEmail] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [referralCode, setReferralCode] = React.useState('')
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!email.trim() || !phone.trim() || !password.trim() || !referralCode.trim()) {
            setError('Complete email, phone, password, and referral code to continue.')
            return
        }

        if (!email.includes('@')) {
            setError('Enter a valid email address.')
            return
        }

        if (phone.replace(/\D/g, '').length < 10) {
            setError('Enter a valid phone number.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setSuccess('Admin login successful. Redirecting to dashboard...')
    }

    return (
        <div className="w-full flex flex-col items-center">
            <Wrapper>
                <section className='w-full sm:h-auto h-[80dvh] sm:rounded-lg sm:p-5 flex flex-col items-center'>
                    <div className='w-full mb-4'>
                        <h1 className='text-xl sm:text-2xl font-semibold'>Admin Login</h1>
                        <p className='text-sm text-muted-foreground'>
                            Access the HotBet admin area with your verified account details.
                        </p>
                    </div>
                    <br />
                    <form onSubmit={handleSubmit} className='sm:w-[500px] space-y-4'>
                        <label className='flex flex-col gap-1 text-sm'>
                            <span className='text-muted-foreground'>Email</span>
                            <Input
                                type='email'
                                autoComplete='email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder='admin@hotbet.com'
                                required
                            />
                        </label>

                        <label className='flex flex-col gap-1 text-sm'>
                            <span className='text-muted-foreground'>Phone</span>
                            <Input
                                type='tel'
                                autoComplete='tel'
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                placeholder='+233 54 000 0000'
                                required
                            />
                        </label>

                        <label className='flex flex-col gap-1 text-sm'>
                            <span className='text-muted-foreground'>Password</span>
                            <Input
                                type='password'
                                autoComplete='current-password'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder='Enter your password'
                                required
                            />
                        </label>

                        <label className='flex flex-col gap-1 text-sm'>
                            <span className='text-muted-foreground'>Referral Code</span>
                            <Input
                                type='text'
                                value={referralCode}
                                onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                                placeholder='Enter referral code'
                                required
                            />
                        </label>

                        <div className='flex items-center justify-between gap-3 text-sm'>
                            <Link replace href={routes.home} className='text-primary hover:underline'>
                                Back to site
                            </Link>
                            <Link replace href={routes.auth.login} className='text-primary hover:underline'>
                                Client login
                            </Link>
                        </div>

                        <Button type='submit' className='w-full'>
                            Login to Admin
                        </Button>

                        {error && <p className='text-sm text-destructive'>{error}</p>}
                        {success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}
                    </form>
                </section>
            </Wrapper>
        </div>
    )
}
