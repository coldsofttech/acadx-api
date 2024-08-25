class CookieValidator {
    constructor() {

    }

    async validatePreference(preference) {
        if (preference !== 'necessary' && preference !== 'all' && preference !== 'declined') {
            throw new Error('Validation Error: Cookie preference should be one of "necessary", "all", "declined".');
        }
    }

    async validateUserInput({ preference }) {
        await this.validatePreference(preference);
    }
}

module.exports = CookieValidator;
