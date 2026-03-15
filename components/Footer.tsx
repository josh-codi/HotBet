import React from 'react'
import Wrapper from './Wrapper'

export default function Footer() {
    return (
        <div className='w-full flex flex-col items-center py-8 text-center border-t bg-slate-900 dark:bg-background text-white'>
            <Wrapper>
                <div className="flex flex-col items-center gap-1">
                    <b className='italic text-3xl font-extrabold'>HotBet</b>
                    <p className='text-sm text-center text-gray-500'>The best sports betting experience.</p>
                </div>
                <div className="flex flex-col items-center gap-1 mt-2">
                    <small>
                        You must be 18+ to register or play. Please play responsibly. Betting can be addictive and may cause harm.
                        HotBet is licensed and regulated by the appropriate authorities.
                    </small>
                    <span className='space-x-4 py-2 md:text-base text-sm'>
                        <span className='underline'>Terms & Condition</span>
                        <span className='underline'>About Us</span>
                    </span>
                </div>
                <br />
                <small className='text-sm text-center'>Copyright © 2024 HotBet. All rights reserved.</small>
            </Wrapper>
        </div>
    )
}
