import React from 'react'
import Wrapper from './Wrapper'
import Image from 'next/image'

const partners = [
    { name: 'Apple Pay', logo: '/assets/apple-pay.png' },
    { name: 'Google Pay', logo: '/assets/google-pay.png' },
    { name: 'Bitcoin', logo: '/assets/banner_bitcoin.png' },
    { name: 'Ethereum', logo: '/assets/banner_etheruem.png' },
    { name: 'MasterCard', logo: '/assets/banner_master_card.png' },
    { name: 'Skrill', logo: '/assets/banner_skrill.png' },
    { name: 'Tether', logo: '/assets/banner_tether.png' },
    { name: 'Visa', logo: '/assets/banner_visa.png' }
]

export default function Footer() {
    return (
        <div className='w-full flex flex-col items-center py-8 text-center border-t bg-slate-900 dark:bg-background text-white overflow-hidden'>
            <Wrapper>
                <div className="flex flex-col items-center gap-1">
                    <b>Official Betting Partners <br /><p className="font-light text-sm">The world most visited betting platform.</p></b>
                    <div className="hotbet-marquee w-full overflow-hidden py-4">
                        <div className="hotbet-marquee-track flex w-max items-center gap-8">
                            {[...partners, ...partners].map((partner, index) => (
                                <Image
                                    key={`${partner.name}-${index}`}
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={96}
                                    height={32}
                                    className='h-8 w-auto shrink-0 object-contain grayscale opacity-70'
                                />
                            ))}
                        </div>
                    </div>
                </div>

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
