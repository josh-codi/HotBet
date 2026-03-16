'use client';
import GoBack from '@/components/GoBack';
import Wrapper from '@/components/Wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useMemo, useState } from 'react';

type MatchStatus = 'pending' | 'live' | 'finished';

type MatchFormState = {
    homeTeam: string;
    awayTeam: string;
    league: string;
    venue: string;
    date: string;
    time: string;
    status: MatchStatus;
};

const initialState: MatchFormState = {
    homeTeam: '',
    awayTeam: '',
    league: '',
    venue: '',
    date: '',
    time: '',
    status: 'pending',
};

const oddsMarketConfig = [
    {
        market: 'Match Result',
        fields: [
            { key: 'matchResult.homeWin', label: 'Home' },
            { key: 'matchResult.draw', label: 'Draw' },
            { key: 'matchResult.awayWin', label: 'Away' },
        ],
    },
    {
        market: 'Both Teams To Score',
        fields: [
            { key: 'bothTeamsToScore.yes', label: 'Yes' },
            { key: 'bothTeamsToScore.no', label: 'No' },
        ],
    },
    {
        market: 'Goals',
        fields: [
            { key: 'goals.over 1.5', label: 'Over 1.5' },
            { key: 'goals.over 2.5', label: 'Over 2.5' },
            { key: 'goals.over 3.5', label: 'Over 3.5' },
            { key: 'goals.under 1.5', label: 'Under 1.5' },
            { key: 'goals.under 2.5', label: 'Under 2.5' },
            { key: 'goals.under 3.5', label: 'Under 3.5' },
        ],
    },
    {
        market: 'Double Chance',
        fields: [
            { key: 'doubleChance.homeOrDraw', label: 'H/D' },
            { key: 'doubleChance.awayOrDraw', label: 'A/D' },
            { key: 'doubleChance.homeOrAway', label: 'H/A' },
        ],
    },
    {
        market: 'Handicap',
        fields: [
            { key: 'handicap.home +1.5', label: 'Home +1.5' },
            { key: 'handicap.away -1.5', label: 'Away -1.5' },
            { key: 'handicap.home +1.0', label: 'Home +1.0' },
            { key: 'handicap.away -1.0', label: 'Away -1.0' },
            { key: 'handicap.home +0.5', label: 'Home +0.5' },
            { key: 'handicap.away -0.5', label: 'Away -0.5' },
            { key: 'handicap.home -0.5', label: 'Home -0.5' },
            { key: 'handicap.away +0.5', label: 'Away +0.5' },
            { key: 'handicap.home -1.0', label: 'Home -1.0' },
            { key: 'handicap.away +1.0', label: 'Away +1.0' },
            { key: 'handicap.home -1.5', label: 'Home -1.5' },
            { key: 'handicap.away +1.5', label: 'Away +1.5' },
        ],
    },
    {
        market: 'First Half Result',
        fields: [
            { key: 'firstHalfResult.homeWin', label: 'Home' },
            { key: 'firstHalfResult.draw', label: 'Draw' },
            { key: 'firstHalfResult.awayWin', label: 'Away' },
        ],
    },
    {
        market: 'Draw No Bet',
        fields: [
            { key: 'drawNoBet.home', label: 'Home' },
            { key: 'drawNoBet.away', label: 'Away' },
        ],
    },
    {
        market: 'Clean Sheet',
        fields: [
            { key: 'cleanSheet.home', label: 'Home' },
            { key: 'cleanSheet.away', label: 'Away' },
        ],
    },
] as const;

const inputClass = 'h-10'

export default function NewMatchPage() {
    const [form, setForm] = useState<MatchFormState>(initialState);
    const [odds, setOdds] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const allOddKeys = useMemo(
        () => oddsMarketConfig.flatMap((section) => section.fields.map((field) => field.key)),
        []
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleOddChange = (key: string, value: string) => {
        setOdds((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        // Basic validation
        if (
            !form.homeTeam ||
            !form.awayTeam ||
            !form.league ||
            !form.venue ||
            !form.date ||
            !form.time
        ) {
            setError('Please fill in all required fields.');
            setSubmitting(false);
            return;
        }

        const isAnyOddMissing = allOddKeys.some((key) => !odds[key]);
        if (isAnyOddMissing) {
            setError('Please provide values for all odds fields.');
            setSubmitting(false);
            return;
        }

        // TODO: Replace with actual API call
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setForm(initialState);
            setOdds({});
        }, 1000);
    };

    return (
        <div className='w-full flex justify-center py-4 sm:py-6'>
            <Wrapper className='w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-0'>
                <GoBack />
                <div className='w-full rounded-lg border border-border bg-card p-3 sm:p-5'>
                    <h1 className='text-xl sm:text-2xl font-semibold'>Create New Match</h1>
                    <p className='mt-1 text-xs sm:text-sm text-muted-foreground'>
                        Add the match details and complete all betting markets.
                    </p>

                    <form onSubmit={handleSubmit} className='mt-5 space-y-5'>
                        <section className='space-y-3'>
                            <h2 className='text-base font-medium'>Match Details</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>Home Team *</span>
                                    <Input
                                        type='text'
                                        name='homeTeam'
                                        value={form.homeTeam}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>Away Team *</span>
                                    <Input
                                        type='text'
                                        name='awayTeam'
                                        value={form.awayTeam}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>League *</span>
                                    <Input
                                        type='text'
                                        name='league'
                                        value={form.league}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>Venue *</span>
                                    <Input
                                        type='text'
                                        name='venue'
                                        value={form.venue}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>Date *</span>
                                    <Input
                                        type='date'
                                        name='date'
                                        value={form.date}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs'>
                                    <span className='text-muted-foreground'>Time *</span>
                                    <Input
                                        type='time'
                                        name='time'
                                        value={form.time}
                                        onChange={handleChange}
                                        className={inputClass}
                                        required
                                    />
                                </label>

                                <label className='flex flex-col gap-1.5 text-xs sm:col-span-2 lg:col-span-1'>
                                    <span className='text-muted-foreground'>Status *</span>
                                    <Select
                                        value={form.status}
                                        onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as MatchStatus }))}
                                    >
                                        <SelectTrigger className={inputClass}>
                                            <SelectValue placeholder='Select status' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='pending'>Pending</SelectItem>
                                            <SelectItem value='live'>Live</SelectItem>
                                            <SelectItem value='finished'>Finished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </label>
                            </div>
                        </section>

                        <section className='space-y-4'>
                            <h2 className='text-base font-medium'>Odds Markets</h2>
                            <p className='text-xs text-muted-foreground'>
                                Complete all odds options from the sample markets.
                            </p>

                            <div className='space-y-3'>
                                {oddsMarketConfig.map((section) => (
                                    <div key={section.market} className='rounded-md border border-border p-3 sm:p-4'>
                                        <h3 className='text-sm font-medium'>{section.market}</h3>
                                        <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
                                            {section.fields.map((field) => (
                                                <label key={field.key} className='flex flex-col gap-1.5 text-xs'>
                                                    <span className='text-muted-foreground'>{field.label}</span>
                                                    <Input
                                                        type='number'
                                                        min={1.05}
                                                        step='0.01'
                                                        value={odds[field.key] ?? ''}
                                                        onChange={(event) => handleOddChange(field.key, event.target.value)}
                                                        className={inputClass}
                                                        required
                                                    />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {error && <div className='text-sm text-destructive'>{error}</div>}
                        {success && (
                            <div className='text-sm text-green-600 dark:text-green-400'>
                                Match created successfully.
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 sm:w-125">
                            <Button variant='outline'
                            className='w-full sm:w-auto sm:min-w-40'
                            disabled={submitting}
                            >
                                Create & Add Another
                            </Button>
                        <Button
                            type='submit'
                            className='w-full '
                            disabled={submitting}
                        >
                            {submitting ? 'Creating...' : 'Create Match'}
                        </Button>
                        
                        </div>
                    </form>
                </div>
            </Wrapper>
        </div>
    );
}