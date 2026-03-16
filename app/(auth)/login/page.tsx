"use client"

import GoBack from '@/components/GoBack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function LoginPage() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!email.trim() || !password.trim()) {
            setError('Enter your email and password to continue.')
            return
        }

        if (!email.includes('@')) {
            setError('Enter a valid email address.')
            return
        }

        setSuccess('Login successful. Redirecting to your dashboard...')
    }

    return (
        <section className='w-full sm:h-auto h-[80dvh] sm:rounded-lg sm:border sm:p-5'>
            <GoBack/>
            <div className='mb-4'>
                <h1 className='text-xl sm:text-2xl font-semibold'>Login</h1>
                <p className='text-sm text-muted-foreground'>
                    Access your HotBet account to place bets and manage your wallet.
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <label className='flex flex-col gap-1 text-sm'>
                    <span className='text-muted-foreground'>Email</span>
                    <Input
                        type='email'
                        autoComplete='email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder='you@example.com'
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

                <div className='flex items-center justify-between gap-3 text-sm'>
                    <Link replace href={routes.auth.forgotPassword} className='text-primary hover:underline'>
                        Forgot password?
                    </Link>
                    <Link replace href={routes.auth.signup} className='text-primary hover:underline'>
                        Create account
                    </Link>
                </div>

                <Button type='submit' className='w-full'>
                    Login
                </Button>

                {error && <p className='text-sm text-destructive'>{error}</p>}
                {success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}
            </form>
        </section>
    )
}
