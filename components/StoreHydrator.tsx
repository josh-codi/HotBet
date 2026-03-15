'use client'

import { useEffect } from 'react'

import { useBettingSlipStore } from '@/lib/betting-slip-store'
import { useBetsStore } from '@/lib/bets-store'
import { useUserStore } from '@/lib/user-store'

export default function StoreHydrator() {
    useEffect(() => {
        void useBettingSlipStore.persist.rehydrate()
        void useBetsStore.persist.rehydrate()
        void useUserStore.persist.rehydrate()
    }, [])

    return null
}
