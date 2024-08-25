class SsoIntegrationIconService {
    constructor() {

    }

    async getIcons() {
        const icons = {
            ...require('@fortawesome/free-brands-svg-icons')
        };

        return Object.keys(icons).sort();
    }
}

module.exports = SsoIntegrationIconService;
