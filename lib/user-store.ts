import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'user' | 'admin'

export type UserInfo = {
    id?: string
    name?: string
    email?: string
    role: UserRole
}

type UserStore = {
    hasHydrated: boolean
    user: UserInfo | null
    setHasHydrated: (value: boolean) => void
    setUser: (user: UserInfo | null) => void
    setRole: (role: UserRole) => void
    clearUser: () => void
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            hasHydrated: false,
            user: null,
            setHasHydrated: (value) => set({ hasHydrated: value }),
            setUser: (user) => set({ user }),
            setRole: (role) =>
                set((state) => ({
                    user: {
                        ...(state.user ?? {}),
                        role
                    }
                })),
            clearUser: () => set({ user: null })
        }),
        {
            name: 'hotbet-user-v1',
            skipHydration: true,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }
        }
    )
)
