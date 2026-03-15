const routes = {
    home: "/",
    auth: {
        login: "/login",
        signup: "/signup",
        changePassword: "/change-password",
        forgotPassword: "/forgot-password",
    },
    live: {
        index: "/live",
    },
    deposit: {
        index: "/deposit",
    },
    bets: {
        index: "/bets",
        ticket: (id: string | number) => `/bets/${id}`,
    },
    me: {
        index: "/me",
    },
    match: {
        index: (id: string | number) => `/match/${id}`,
    },
    admin: {
        index: '/nimda',
        matches: {
            index: '/nimda/matches',
            match: (id: string | number) => `/nimda/matches/${id}`,
            new: '/nimda/matches/new',
        },
        users: '/nimda/all-users',
        "paid-users": '/nimda/paid-users',
        funds: {
            index: '/nimda/funds',
        },
    }
}

export default routes