'use client'

import GoBack from '@/components/GoBack'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

type UserStatus = 'active' | 'suspended'

type UserRecord = {
  id: string
  name: string
  email: string
  joined: string
  status: UserStatus
}

const initialUsers: UserRecord[] = [
  { id: 'USR-1001', name: 'Joshua Odame', email: 'joshua@hotbet.com', status: 'active', joined: '2026-03-01' },
  { id: 'USR-1002', name: 'Ama Mensah', email: 'ama@hotbet.com', status: 'active', joined: '2026-03-03' },
  { id: 'USR-1003', name: 'Kojo Owusu', email: 'kojo@hotbet.com', status: 'suspended', joined: '2026-03-05' },
  { id: 'USR-1004', name: 'Nana Addo', email: 'nana@hotbet.com', status: 'active', joined: '2026-03-07' }
]

export default function AllUsers() {
  const [query, setQuery] = React.useState('')
  const [users, setUsers] = React.useState<UserRecord[]>(initialUsers)

  const filteredUsers = users.filter((user) => {
    const target = `${user.name} ${user.email} ${user.id}`.toLowerCase()
    return target.includes(query.toLowerCase())
  })

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
          : user
      )
    )
  }

  return (
    <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
      <Wrapper className='gap-4'>
        <GoBack />

        <div className='w-full'>
          <h1 className='text-xl sm:text-2xl font-semibold'>All Users</h1>
          <p className='text-sm text-muted-foreground'>
            Review and manage account access across the platform.
          </p>
        </div>

        <div className='w-full rounded-lg border p-3 sm:p-4 space-y-3'>
          <Input
            type='text'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Search by name, email, or user ID'
            className='h-10 w-full rounded-md border bg-background px-3 text-sm'
          />

          <div className='w-full overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-muted-foreground border-b'>
                  <th className='px-3 py-2 font-medium'>User</th>
                  <th className='px-3 py-2 font-medium'>ID</th>
                  <th className='px-3 py-2 font-medium'>Joined</th>
                  <th className='px-3 py-2 font-medium'>Status</th>
                  <th className='px-3 py-2 font-medium text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className='border-b last:border-0'>
                    <td className='px-3 py-3'>
                      <p className='font-medium'>{user.name}</p>
                      <p className='text-xs text-muted-foreground'>{user.email}</p>
                    </td>
                    <td className='px-3 py-3'>{user.id}</td>
                    <td className='px-3 py-3'>{user.joined}</td>
                    <td className='px-3 py-3'>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${user.status === 'active' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-red-500/15 text-red-700'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className='px-3 py-3 text-right'>
                      <Button
                        size='xs'
                        variant={user.status === 'active' ? 'destructive' : 'outline'}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}
