import BettingSlip from '@/components/BettingSlip'
import GoBack from '@/components/GoBack'
import MatchListing from '@/components/MatchListing'
import Wrapper from '@/components/Wrapper'
import matches from '@/constants/matches'

export default function LivePage() {
    const liveMatches = matches.filter((match) => match.status === 'live')

    return (
        <div className='w-full flex flex-col items-center gap-5 py-4 sm:py-6'>
            <Wrapper className='gap-4 flex-row items-start'>
                <div className="flex flex-col w-full">
                    <GoBack />
                    <div className='w-full mb-4 pb-3 border-b'>
                        <h1 className='text-xl sm:text-2xl font-semibold'>Live Matches</h1>
                        <p className='text-sm text-muted-foreground'>
                            Follow live fixtures and add your picks quickly.
                        </p>
                    </div>

                    <section className='w-full'>
                        {liveMatches.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>No live matches right now.</p>
                        ) : (
                            <div className='flex flex-col gap-1'>
                                {liveMatches.map((match) => (
                                    <MatchListing key={match.id} match={match} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
                <BettingSlip />
            </Wrapper>
        </div>
    )
}
