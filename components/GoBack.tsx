'use client';
import { ArrowLeft } from 'lucide-react';
import React from 'react'

export default function GoBack() {
    return (
        <div className="w-full pb-2">
            <button className='flex items-center gap-2 text-sm' onClick={() => window.history.back()}>
                <ArrowLeft className='size-4' />
                Back
            </button>
        </div>
    )
}
