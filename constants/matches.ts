type BaseMatch = {
    id: number
    homeTeam: string
    awayTeam: string
    league: string
    dateTime: string
    venue: string
    homeWin: number
    draw: number
    awayWin: number
    status: 'pending' | 'live' | 'finished'
    statistics: {
        homeTeamRecentForm: string
        awayTeamRecentForm: string
    }
}

type RawOdds = {
    homeWin: number
    draw: number
    awayWin: number
    bothTeamsToScore: number
    bothTeamsToScoreNo: number
    over15Goals: number
    over25Goals: number
    over35Goals: number
    under15Goals: number
    under25Goals: number
    under35Goals: number
    homeOrDraw: number
    awayOrDraw: number
    homeOrAway: number
    firstHalfHomeWin: number
    firstHalfDraw: number
    firstHalfAwayWin: number
    drawNoBetHome: number
    drawNoBetAway: number
    cleanSheetHome: number
    cleanSheetAway: number
}

const n = (value: number) => Number(Math.max(1.05, value).toFixed(2))

const buildCorrectScoreOdds = (homeWin: number, draw: number, awayWin: number) => {
    const homeStrength = awayWin / homeWin
    const awayStrength = homeWin / awayWin
    const drawWeight = draw / 3

    return {
        '1-0': n(6.6 - homeStrength * 0.6),
        '2-0': n(8.7 - homeStrength * 0.55),
        '2-1': n(8.2 - homeStrength * 0.45),
        '3-0': n(14.2 - homeStrength * 0.4),
        '3-1': n(13.6 - homeStrength * 0.38),
        '3-2': n(19.8 - homeStrength * 0.26),
        '4-0': n(28.4 - homeStrength * 0.18),
        '4-1': n(30.1 - homeStrength * 0.16),
        '4-2': n(41.5 - homeStrength * 0.12),
        '0-0': n(7.4 + drawWeight * 0.8),
        '1-1': n(6.0 + drawWeight * 0.55),
        '2-2': n(12.8 + drawWeight * 0.32),
        '0-1': n(6.7 - awayStrength * 0.5),
        '0-2': n(10.6 - awayStrength * 0.32),
        '1-2': n(9.1 - awayStrength * 0.4),
        '0-3': n(22.9 - awayStrength * 0.18),
        '1-3': n(18.4 - awayStrength * 0.22),
        '2-3': n(24.7 - awayStrength * 0.16),
        '1-4': n(43.6 - awayStrength * 0.1),
        '2-4': n(53.2 - awayStrength * 0.08)
    }
}

const buildRawOdds = (homeWin: number, draw: number, awayWin: number): RawOdds => {
    const over25 = n(1.45 + (draw - 3.0) * 0.18)

    return {
        homeWin,
        draw,
        awayWin,
        bothTeamsToScore: n(1.55 + (draw - 3.0) * 0.1),
        bothTeamsToScoreNo: n(2.6 - (draw - 3.0) * 0.22),
        over15Goals: n(over25 - 0.35),
        over25Goals: over25,
        over35Goals: n(over25 + 0.75),
        under15Goals: n(4.9 - over25),
        under25Goals: n(3.5 - over25),
        under35Goals: n(2.95 - over25),
        homeOrDraw: n(1 + (homeWin - 1) * 0.45),
        awayOrDraw: n(1 + (awayWin - 1) * 0.45),
        homeOrAway: n(1 + Math.abs(homeWin - awayWin) * 0.04 + 0.23),
        firstHalfHomeWin: n(homeWin + 0.55),
        firstHalfDraw: n(draw - 1.1),
        firstHalfAwayWin: n(awayWin + 0.55),
        drawNoBetHome: n(1 + (homeWin - 1) * 0.6),
        drawNoBetAway: n(1 + (awayWin - 1) * 0.6),
        cleanSheetHome: n(2.1 + (awayWin - 1.5) * 0.55),
        cleanSheetAway: n(2.1 + (homeWin - 1.5) * 0.55)
    }
}

const baseMatches: BaseMatch[] = [
    { id: 1, homeTeam: 'Manchester United', awayTeam: 'Chelsea', league: 'Premier League', dateTime: '2026-04-12T17:30:00Z', venue: 'Old Trafford', homeWin: 2.1, draw: 3.4, awayWin: 3.0, status: 'live', statistics: { homeTeamRecentForm: 'WDLWW', awayTeamRecentForm: 'LWDWL' } },
    { id: 2, homeTeam: 'Liverpool', awayTeam: 'Arsenal', league: 'Premier League', dateTime: '2026-04-13T19:00:00Z', venue: 'Anfield', homeWin: 2.25, draw: 3.55, awayWin: 2.95, status: 'finished', statistics: { homeTeamRecentForm: 'WWDWL', awayTeamRecentForm: 'WDWWW' } },
    { id: 3, homeTeam: 'Manchester City', awayTeam: 'Tottenham', league: 'Premier League', dateTime: '2026-04-14T16:30:00Z', venue: 'Etihad Stadium', homeWin: 1.74, draw: 4.05, awayWin: 4.5, status: 'live', statistics: { homeTeamRecentForm: 'WWWWW', awayTeamRecentForm: 'LWWDL' } },
    { id: 4, homeTeam: 'Barcelona', awayTeam: 'Atletico Madrid', league: 'La Liga', dateTime: '2026-04-14T20:00:00Z', venue: 'Estadi Olimpic Lluis Companys', homeWin: 2.05, draw: 3.3, awayWin: 3.75, status: 'live', statistics: { homeTeamRecentForm: 'WWDWW', awayTeamRecentForm: 'DWWLW' } },
    { id: 5, homeTeam: 'Real Madrid', awayTeam: 'Sevilla', league: 'La Liga', dateTime: '2026-04-15T19:30:00Z', venue: 'Santiago Bernabeu', homeWin: 1.62, draw: 4.2, awayWin: 5.35, status: 'pending', statistics: { homeTeamRecentForm: 'WWWDW', awayTeamRecentForm: 'LDWLW' } },
    { id: 6, homeTeam: 'Bayern Munich', awayTeam: 'RB Leipzig', league: 'Bundesliga', dateTime: '2026-04-16T17:30:00Z', venue: 'Allianz Arena', homeWin: 1.85, draw: 3.95, awayWin: 4.0, status: 'pending', statistics: { homeTeamRecentForm: 'WWWDL', awayTeamRecentForm: 'WWLWD' } },
    { id: 7, homeTeam: 'Borussia Dortmund', awayTeam: 'Bayer Leverkusen', league: 'Bundesliga', dateTime: '2026-04-16T19:30:00Z', venue: 'Signal Iduna Park', homeWin: 2.55, draw: 3.75, awayWin: 2.6, status: 'pending', statistics: { homeTeamRecentForm: 'WLDWW', awayTeamRecentForm: 'WWWLW' } },
    { id: 8, homeTeam: 'Inter Milan', awayTeam: 'Napoli', league: 'Serie A', dateTime: '2026-04-17T18:45:00Z', venue: 'San Siro', homeWin: 2.12, draw: 3.25, awayWin: 3.5, status: 'live', statistics: { homeTeamRecentForm: 'WWDWD', awayTeamRecentForm: 'WLWWW' } },
    { id: 9, homeTeam: 'Juventus', awayTeam: 'AC Milan', league: 'Serie A', dateTime: '2026-04-17T20:00:00Z', venue: 'Allianz Stadium', homeWin: 2.4, draw: 3.1, awayWin: 3.1, status: 'pending', statistics: { homeTeamRecentForm: 'WDWDL', awayTeamRecentForm: 'WLDDW' } },
    { id: 10, homeTeam: 'Paris Saint-Germain', awayTeam: 'Marseille', league: 'Ligue 1', dateTime: '2026-04-18T19:45:00Z', venue: 'Parc des Princes', homeWin: 1.67, draw: 4.15, awayWin: 4.9, status: 'pending', statistics: { homeTeamRecentForm: 'WWWWW', awayTeamRecentForm: 'WLDWW' } },
    { id: 11, homeTeam: 'Monaco', awayTeam: 'Lille', league: 'Ligue 1', dateTime: '2026-04-18T17:00:00Z', venue: 'Stade Louis II', homeWin: 2.18, draw: 3.4, awayWin: 3.3, status: 'pending', statistics: { homeTeamRecentForm: 'DWWLW', awayTeamRecentForm: 'WWLWD' } },
    { id: 12, homeTeam: 'Benfica', awayTeam: 'Porto', league: 'Primeira Liga', dateTime: '2026-04-19T20:15:00Z', venue: 'Estadio da Luz', homeWin: 2.2, draw: 3.2, awayWin: 3.25, status: 'pending', statistics: { homeTeamRecentForm: 'WWDLW', awayTeamRecentForm: 'DWWWW' } },
    { id: 13, homeTeam: 'Ajax', awayTeam: 'PSV Eindhoven', league: 'Eredivisie', dateTime: '2026-04-20T18:00:00Z', venue: 'Johan Cruyff Arena', homeWin: 2.48, draw: 3.7, awayWin: 2.62, status: 'pending', statistics: { homeTeamRecentForm: 'LWWDW', awayTeamRecentForm: 'WWWWD' } },
    { id: 14, homeTeam: 'Celtic', awayTeam: 'Rangers', league: 'Scottish Premiership', dateTime: '2026-04-20T12:30:00Z', venue: 'Celtic Park', homeWin: 2.02, draw: 3.4, awayWin: 3.55, status: 'pending', statistics: { homeTeamRecentForm: 'WWWWW', awayTeamRecentForm: 'WLWWW' } },
    { id: 15, homeTeam: 'LA Galaxy', awayTeam: 'Inter Miami', league: 'MLS', dateTime: '2026-04-21T02:30:00Z', venue: 'Dignity Health Sports Park', homeWin: 2.75, draw: 3.6, awayWin: 2.45, status: 'pending', statistics: { homeTeamRecentForm: 'WDLWL', awayTeamRecentForm: 'WWDWW' } },
    { id: 16, homeTeam: 'Flamengo', awayTeam: 'Palmeiras', league: 'Brasileirao Serie A', dateTime: '2026-04-21T23:00:00Z', venue: 'Maracana', homeWin: 2.3, draw: 3.05, awayWin: 3.35, status: 'live', statistics: { homeTeamRecentForm: 'WWLDW', awayTeamRecentForm: 'WDWWW' } },
    { id: 17, homeTeam: 'Al Ahly', awayTeam: 'Zamalek', league: 'Egyptian Premier League', dateTime: '2026-04-22T18:00:00Z', venue: 'Cairo International Stadium', homeWin: 2.35, draw: 2.95, awayWin: 3.45, status: 'live', statistics: { homeTeamRecentForm: 'WWWWD', awayTeamRecentForm: 'WDWDL' } },
    { id: 18, homeTeam: 'Kaizer Chiefs', awayTeam: 'Mamelodi Sundowns', league: 'South African Premiership', dateTime: '2026-04-23T15:00:00Z', venue: 'FNB Stadium', homeWin: 3.35, draw: 3.0, awayWin: 2.15, status: 'pending', statistics: { homeTeamRecentForm: 'WDLWL', awayTeamRecentForm: 'WWWWW' } },
    { id: 19, homeTeam: 'Boca Juniors', awayTeam: 'River Plate', league: 'Argentine Primera Division', dateTime: '2026-04-24T20:00:00Z', venue: 'La Bombonera', homeWin: 2.58, draw: 2.92, awayWin: 2.95, status: 'pending', statistics: { homeTeamRecentForm: 'WDWLW', awayTeamRecentForm: 'WWDLW' } },
    { id: 20, homeTeam: 'Urawa Red Diamonds', awayTeam: 'Kawasaki Frontale', league: 'J1 League', dateTime: '2026-04-25T10:00:00Z', venue: 'Saitama Stadium', homeWin: 2.78, draw: 3.25, awayWin: 2.52, status: 'finished', statistics: { homeTeamRecentForm: 'WWLDW', awayTeamRecentForm: 'WLWWW' } },
    { id: 21, homeTeam: 'Al Hilal', awayTeam: 'Al Nassr', league: 'Saudi Pro League', dateTime: '2026-04-26T18:00:00Z', venue: 'Kingdom Arena', homeWin: 2.08, draw: 3.5, awayWin: 3.15, status: 'pending', statistics: { homeTeamRecentForm: 'WWWLW', awayTeamRecentForm: 'WDWWW' } }
]

export default baseMatches.map((match) => {
    const raw = buildRawOdds(match.homeWin, match.draw, match.awayWin)
    const correctScore = buildCorrectScoreOdds(match.homeWin, match.draw, match.awayWin)

    return {
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        league: match.league,
        dateTime: match.dateTime,
        venue: match.venue,
        status: match.status,
        statistics: match.statistics,
        odds: {
            matchResult: {
                homeWin: raw.homeWin,
                draw: raw.draw,
                awayWin: raw.awayWin
            },
            bothTeamsToScore: {
                yes: raw.bothTeamsToScore,
                no: raw.bothTeamsToScoreNo
            },
            goals: {
                'over 1.5': raw.over15Goals,
                'over 2.5': raw.over25Goals,
                'over 3.5': raw.over35Goals,
                'under 1.5': raw.under15Goals,
                'under 2.5': raw.under25Goals,
                'under 3.5': raw.under35Goals
            },
            doubleChance: {
                homeOrDraw: raw.homeOrDraw,
                awayOrDraw: raw.awayOrDraw,
                homeOrAway: raw.homeOrAway
            },
            correctScore,
            handicap: {
                'home +1.5': n(1 + (raw.homeWin - 1) * 0.28),
                'away -1.5': n(raw.awayWin * 1.72),
                'home +1.0': n(1 + (raw.homeWin - 1) * 0.42),
                'away -1.0': n(raw.awayWin * 1.44),
                'home +0.5': n(1 + (raw.homeWin - 1) * 0.6),
                'away -0.5': n(raw.awayWin * 1.2),
                'home -0.5': n(raw.homeWin * 1.18),
                'away +0.5': n(1 + (raw.awayWin - 1) * 0.56),
                'home -1.0': n(raw.homeWin * 1.4),
                'away +1.0': n(1 + (raw.awayWin - 1) * 0.4),
                'home -1.5': n(raw.homeWin * 1.68),
                'away +1.5': n(1 + (raw.awayWin - 1) * 0.28)
            },
            firstHalfResult: {
                homeWin: raw.firstHalfHomeWin,
                draw: raw.firstHalfDraw,
                awayWin: raw.firstHalfAwayWin
            },
            drawNoBet: {
                home: raw.drawNoBetHome,
                away: raw.drawNoBetAway
            },
            cleanSheet: {
                home: raw.cleanSheetHome,
                away: raw.cleanSheetAway
            }
        }
    }
})
