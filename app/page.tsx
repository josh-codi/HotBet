'use client';
import MatchListing from "@/components/MatchListing"
import BettingSlip from "@/components/BettingSlip"
import { Button } from "@/components/ui/button"
import Wrapper from "@/components/Wrapper"
import matches from "../constants/matches"
import { Clock1, Code, Gamepad2, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import routes from "@/routes"

export default function Page() {
  const liveCount = matches.filter((m) => m.status === 'live').length

  return (
    <div className="flex flex-col items-center min-h-svh pt-4 pb-10">
      <Wrapper className="flex-row items-start md:gap-5">
        {/* Main column */}
        <div className="w-full flex flex-col gap-5 min-w-0">

          {/* Hero banner */}
          <div className="w-full relative p-0.5 bg-linear-to-bl from-red-500 via-purple-800 to-blue-800 rounded-2xl overflow-hidden">
            <Image
              src="https://i.pinimg.com/1200x/51/45/30/514530c56b20d4658c7ff888f280425c.jpg"
              alt="banner"
              width={1200}
              height={400}
              priority
              className="w-full h-44 sm:h-60 lg:h-72 object-cover rounded-2xl"
            />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between bg-linear-to-r from-black/80 via-black/50 to-transparent rounded-2xl">
              <div className="flex flex-col gap-2">
                <div className="hidden md:flex items-center justify-center size-9 sm:size-10 border border-white/30 rounded-xl bg-white/10 backdrop-blur-sm w-fit">
                  <Trophy className="size-4 text-white" />
                </div>
                <h1 className="text sm:text-lg lg:text-xl font-extrabold text-white leading-tight">
                  Welcome to HotBet...
                </h1>
                <p className="text-xs sm:text-sm italic text-white/90 max-w-[90%]">
                  Experience the thrill of sports betting like never before. <span className="md:block hidden">Sign up today and get a 100% welcome bonus on your first deposit. Don&apos;t miss out on the action!</span>
                  <br />
                  <span className="text-[11px] text-yellow-300 font-semibold">
                    100% Welcome Bonus!
                  </span>
                </p>
              </div>
              <Link href={routes.auth.signup}>
                <Button variant={'outline'} className="self-start px-6 sm:px-10 lg:mt-2" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter tabs — horizontally scrollable on mobile */}
          <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-3 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <Button
              type="button"
              variant="default"
              className="shrink-0 px-4 sm:px-5 gap-1.5 text-sm"
            >
              <Gamepad2 className="size-4" />
              Football
            </Button>
            <Link href={routes.live.index}>
              <Button
                type="button"
                variant="outline"
                className="shrink-0 px-4 sm:px-5 gap-1.5 text-sm"
              >
                <Clock1 className="size-4" />
                Live
                {liveCount > 0 && (
                  <span className="ml-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] font-bold text-white">
                    {liveCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 px-4 sm:px-5 gap-1.5 text-sm"
              onClick={() => {
                document.getElementById('show-betting-slip')?.click();
              }}
            >
              <Code className="size-4" />
              Load Code
            </Button>
          </div>

          {/* Matches list */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between w-full border-b pb-3">
              <div>
                <b className="text-base sm:text-lg">Available Matches</b>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Bet on your favourite teams and players in real-time.
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {matches.length} matches
              </span>
            </div>
            <div className="flex flex-col w-full gap-1">
              {(matches.filter(match => match.status !== 'finished')).map((match, index) => (
                <MatchListing key={index} match={match} />
              ))}
            </div>
          </div>
        </div>

        {/* Betting slip */}
        <BettingSlip />
      </Wrapper>
    </div>
  )
}
