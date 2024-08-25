const MsSqlDbConfig = require('../dbConfigs/mssql');
const ConfigService = require('../helpers/ConfigService');
const CookieValidator = require('../validators/CookieValidator');

const dbConfig = new MsSqlDbConfig();

class CookieService {
    constructor() {
        this.dbPool = null;
        this.configService = new ConfigService();
        this.cookieValidator = new CookieValidator();
    }

    async init() {
        if (!this.dbPool) {
            this.dbPool = await dbConfig.connect();
        }
    }

    async setCookie(response, preference) {
        await this.cookieValidator.validateUserInput({ preference });

        const getConfigValue = async (component, category, key, defaultValue) => {
            try {
                const config = await this.configService.getConfigByConfiguration(component, category, key);
                return config ? config.value : defaultValue;
            } catch {
                return defaultValue;
            }
        }

        const maxAge = Number(await getConfigValue('AcadX UI', 'COOKIE', 'MAX_AGE', 86400000));
        const path = await getConfigValue('AcadX UI', 'COOKIE', 'PATH', '/');
        const environment = await getConfigValue('AcadX', 'GENERAL', 'ENVIRONMENT', 'dev')
        const secure = environment === 'prod';

        response.cookie('cookieConsent', preference, {
            maxAge,
            path: path,
            httpOnly: true,
            sameSite: 'Lax',
            secure: secure
        });

        return {
            name: 'cookieConsent',
            value: preference
        };
    }

    async getCookie(request) {
        const preference = request.cookies.cookieConsent;

        if (!preference) {
            throw new Error('cookieConsent not found. Please set your cookie preference.');
        }

        return {
            name: 'cookieConsent',
            value: preference
        }
    }
}

module.exports = CookieService;