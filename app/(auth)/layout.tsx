import BettingSlip from "@/components/BettingSlip"
import Wrapper from "@/components/Wrapper"

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="w-full flex flex-col items-center gap-5 py-4 sm:py-6">
            <Wrapper className='gap-4 flex-row items-start'>
                <div className="w-full flex flex-col">
                    {children}
                </div>
                <BettingSlip />
            </Wrapper>
        </div>
    )
}
