'use client';

import Link from 'next/link';
import React from 'react'
import { useUserStore } from '@/lib/user-store';

export default function BrandName({ className }: { className?: string }) {
    const hasHydrated = useUserStore((state) => state.hasHydrated)
    const role = useUserStore((state) => state.user?.role)

    const href = hasHydrated && role === 'admin' ? '/nimda' : '/'

    return (
        <Link href={href}>
            <div className={`italic text-3xl font-extrabold ${className ?? ''}`}>HotBet</div>
        </Link>
    )
}
