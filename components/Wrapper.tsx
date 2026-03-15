import React from 'react'

export default function Wrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`px-4 flex flex-col items-center w-full lg:w-250 ${className}`}>{children}</div>
    )
}
