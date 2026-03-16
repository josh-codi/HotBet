"use client"

import GoBack from '@/components/GoBack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function SignupPage() {
	const [name, setName] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [password, setPassword] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [error, setError] = React.useState('')
	const [success, setSuccess] = React.useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
			setError('Complete all fields before continuing.')
			return
		}

		if (!email.includes('@')) {
			setError('Enter a valid email address.')
			return
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters.')
			return
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setSuccess('Account created successfully. You can now log in.')
	}

	return (
		<section className='w-full sm:h-auto h-[80dvh] sm:rounded-lg sm:border sm:p-5'>
			<GoBack/>
			<div className='mb-4'>
				<h1 className='text-xl sm:text-2xl font-semibold'>Create Account</h1>
				<p className='text-sm text-muted-foreground'>
					Join HotBet and start placing smarter bets.
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<label className='flex flex-col gap-1 text-sm'>
					<span className='text-muted-foreground'>Full Name</span>
					<Input
						type='text'
						autoComplete='name'
						value={name}
						onChange={(event) => setName(event.target.value)}
						placeholder='Your full name'
						required
					/>
				</label>

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
						autoComplete='new-password'
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder='Create a password'
						required
					/>
				</label>

				<label className='flex flex-col gap-1 text-sm'>
					<span className='text-muted-foreground'>Confirm Password</span>
					<Input
						type='password'
						autoComplete='new-password'
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						placeholder='Repeat your password'
						required
					/>
				</label>

				<div className='flex items-center justify-end text-sm'>
					<Link replace href={routes.auth.login} className='text-primary hover:underline'>
						Already have an account? Login
					</Link>
				</div>

				<Button type='submit' className='w-full'>
					Create Account
				</Button>

				{error && <p className='text-sm text-destructive'>{error}</p>}
				{success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}
			</form>
		</section>
	)
}
