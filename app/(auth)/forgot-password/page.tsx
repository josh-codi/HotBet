"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function ForgotPasswordPage() {
	const [email, setEmail] = React.useState('')
	const [message, setMessage] = React.useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!email.trim() || !email.includes('@')) {
			setMessage('Enter a valid email address to receive reset instructions.')
			return
		}

		setMessage('Password reset link sent. Check your inbox and spam folder.')
	}

	return (
		<section className='w-full rounded-lg border p-4 sm:p-5'>
			<div className='mb-4'>
				<h1 className='text-xl sm:text-2xl font-semibold'>Forgot Password</h1>
				<p className='text-sm text-muted-foreground'>
					Enter your account email and we will send a reset link.
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

				<Button type='submit' className='w-full'>
					Send Reset Link
				</Button>

				<div className='flex items-center justify-between text-sm'>
					<Link href={routes.auth.login} className='text-primary hover:underline'>
						Back to Login
					</Link>
					<Link href={routes.auth.changePassword} className='text-primary hover:underline'>
						I have a reset code
					</Link>
				</div>

				{message && <p className='text-sm text-muted-foreground'>{message}</p>}
			</form>
		</section>
	)
}
