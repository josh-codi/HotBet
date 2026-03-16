// Requires: API_FOOTBALL_KEY in .env.local
// Get a free key at https://dashboard.api-sports.io/register

const CACHE_TTL_MS = 3 * 60 * 60 * 1000

type LiveResponse = {
    response: unknown[]
    results: number
    source: 'api-football'
    ok: boolean
    reason?: 'missing_api_key' | 'upstream_error' | 'unknown_error'
    status?: number
    cached?: boolean
    stale?: boolean
    cacheTtlMs?: number
}

let cache: {
    value: LiveResponse | null
    expiresAt: number
} = {
    value: null,
    expiresAt: 0
}

export async function GET() {
    const now = Date.now()
    if (cache.value && now < cache.expiresAt) {
        return Response.json({ ...cache.value, cached: true, cacheTtlMs: CACHE_TTL_MS }, { status: 200 })
    }

    const key = process.env.API_FOOTBALL_KEY

    if (!key) {
        const payload: LiveResponse = {
            response: [],
            results: 0,
            source: 'api-football',
            ok: false,
            reason: 'missing_api_key',
            cacheTtlMs: CACHE_TTL_MS
        }
        cache = { value: payload, expiresAt: now + CACHE_TTL_MS }
        return Response.json(payload, { status: 200 })
    }

    const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: { 'x-apisports-key': key },
        next: { revalidate: 10800 }
    })

    if (!res.ok) {
        const payload: LiveResponse = {
            response: [],
            results: 0,
            source: 'api-football',
            ok: false,
            reason: 'upstream_error',
            status: res.status,
            cacheTtlMs: CACHE_TTL_MS
        }

        if (cache.value) {
            return Response.json({ ...cache.value, stale: true, reason: 'upstream_error', status: res.status }, { status: 200 })
        }

        cache = { value: payload, expiresAt: now + CACHE_TTL_MS }
        return Response.json(payload, { status: 200 })
    }

    const data = await res.json()
    const payload: LiveResponse = {
        ...data,
        source: 'api-football',
        ok: true,
        cacheTtlMs: CACHE_TTL_MS
    }

    cache = { value: payload, expiresAt: now + CACHE_TTL_MS }
    return Response.json(payload, { status: 200 })
}
