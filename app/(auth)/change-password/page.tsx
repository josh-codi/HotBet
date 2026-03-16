"use client"

import GoBack from '@/components/GoBack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import routes from '@/routes'
import Link from 'next/link'
import React from 'react'

export default function ChangePasswordPage() {
	const [resetCode, setResetCode] = React.useState('')
	const [newPassword, setNewPassword] = React.useState('')
	const [confirmPassword, setConfirmPassword] = React.useState('')
	const [error, setError] = React.useState('')
	const [success, setSuccess] = React.useState('')

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setSuccess('')

		if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
			setError('Provide your reset code and both password fields.')
			return
		}
        
		if (newPassword.length < 6) {
			setError('New password must be at least 6 characters.')
			return
		}

		if (newPassword !== confirmPassword) {
			setError('Passwords do not match.')
			return
		}

		setSuccess('Password changed successfully. You can now login with your new password.')
	}

	return (
		<section className='w-full sm:h-auto h-[80dvh] sm:rounded-lg sm:border sm:p-5'>
			<GoBack/>

			<div className='mb-4'>
				<h1 className='text-xl sm:text-2xl font-semibold'>Change Password</h1>
				<p className='text-sm text-muted-foreground'>
					Enter the reset code sent to your email and choose a new password.
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<label className='flex flex-col gap-1 text-sm'>
					<span className='text-muted-foreground'>Reset Code</span>
					<Input
						type='text'
						value={resetCode}
						onChange={(event) => setResetCode(event.target.value)}
						placeholder='Enter reset code'
						required
					/>
				</label>

				<label className='flex flex-col gap-1 text-sm'>
					<span className='text-muted-foreground'>New Password</span>
					<Input
						type='password'
						autoComplete='new-password'
						value={newPassword}
						onChange={(event) => setNewPassword(event.target.value)}
						placeholder='Enter new password'
						required
					/>
				</label>

				<label className='flex flex-col gap-1 text-sm'>
					<span className='text-muted-foreground'>Confirm New Password</span>
					<Input
						type='password'
						autoComplete='new-password'
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						placeholder='Confirm new password'
						required
					/>
				</label>

				<Button type='submit' className='w-full'>
					Update Password
				</Button>

				<div className='flex items-center justify-between text-sm'>
					<Link replace href={routes.auth.forgotPassword} className='text-primary hover:underline'>
						Request new reset link
					</Link>
					<Link replace href={routes.auth.login} className='text-primary hover:underline'>
						Back to Login
					</Link>
				</div>

				{error && <p className='text-sm text-destructive'>{error}</p>}
				{success && <p className='text-sm text-green-600 dark:text-green-400'>{success}</p>}
			</form>
		</section>
	)
}
