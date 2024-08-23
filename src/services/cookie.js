require('dotenv').config();

class CookieService {
    constructor() {

    }

    async setCookie(res, preference) {
        const maxAge = process.env.COOKIE_AGE;
        const path = '/'
        const httpOnly = true
        const sameSite = 'Lax'
        const secure = process.env.ENVIRONMENT === 'prod'

        if (preference == 'necessary') {
            res.cookie('cookieConsent', 'necessary', { 
                maxAge, 
                path: path,
                httpOnly: httpOnly,
                sameSite: sameSite,
                secure: secure
            });
        } else if (preference == 'all') {
            res.cookie('cookieConsent', 'all', { 
                maxAge, 
                path: path,
                httpOnly: httpOnly,
                sameSite: sameSite,
                secure: secure
            });
        } else if (preference == 'declined') {
            res.cookie('cookieConsent', 'declined', {
                maxAge,
                path: path,
                httpOnly: httpOnly,
                sameSite: sameSite,
                secure: secure
            });
        } else {
            throw new Error('Invalid cookie preference. Valid options are "necessary" or "all".');
        }
    }

    async getCookie(req) {
        const cookieConsent = req.cookies.cookieConsent;

        if (!cookieConsent) {
            throw new Error('No cookie consent found. Please set your cookie preference.');
        }

        return cookieConsent;
    }
}

module.exports = CookieService;
