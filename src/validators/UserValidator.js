class UserValidator {
    constructor(titleService, ssoIntegrationService) {
        this.titleService = titleService
        this.ssoIntegrationService = ssoIntegrationService;
    }

    async validateMandatoryFields(first_name, last_name, email) {
        if (!first_name || !last_name || !email) {
            throw new Error('Validation Error: required mandatory field(s) missing. Mandatory field(s) include "first_name", "last_name", "email".');
        }
    }

    async validateTitle(title) {
        if (isNaN(title) || !Number.isInteger(title)) {
            throw new Error('Validation Error: "title" must be an integer.');
        }

        try {
            await this.titleService.getTitleById(title);
        } catch (error) {
            throw new Error(`Validation Error: Title with ID "${title}" does not exist in the system.`);
        }
    }

    async validateFirstName(first_name) {
        if (typeof first_name !== 'string') {
            throw new Error('Validation Error: "first_name" is required and must be a string.');
        }
    }

    async validateMiddleName(middle_name) {
        if (typeof middle_name !== 'string') {
            throw new Error('Validation Error: "middle_name" must be a string.');
        }
    }

    async validateLastName(last_name) {
        if (typeof last_name !== 'string') {
            throw new Error('Validation Error: "last_name" is required and must be a string.');
        }
    }

    async validateDob(dob) {
        if (typeof dob !== 'string') {
            throw new Error('Validation Error: "dob" must be a string.');
        }

        const regexDateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!regexDateFormat.test(dob)) {
            throw new Error('Validation Error: "dob" must be in the format of YYYY-MM-DD.');
        }

        const [year, month, day] = dob.split('-').map(num => parseInt(num, 10));
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Validation Error: "dob" contains invalid date components.');
        }

        const parsedDob = new Date(year, month - 1, day);
        if (parsedDob.getFullYear() !== year || parsedDob.getMonth() !== month - 1 || parsedDob.getDate() !== day) {
            throw new Error('Validation Error: "dob" is not a valid date.');
        }
    }

    async validateEmail(email) {
        if (typeof email !== 'string') {
            throw new Error('Validation Error: "email" is required and must be a string.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Validation Error: "email" must be a valid email address.');
        }
    }

    async validatePassword(password) {
        if (typeof password !== 'string') {
            throw new Error('Validation Error: "password" is a required field and must be a string.');
        }
    }

    async validateSsoIntegrator(sso_integrator) {
        if (isNaN(sso_integrator) || !Number.isInteger(sso_integrator)) {
            throw new Error('Validation Error: "sso_integrator" must be an integer.');
        }

        try {
            await this.ssoIntegrationService.getSsoIntegrationById(sso_integrator);
        } catch (error) {
            throw new Error(`Validation Error: SSO Integration with ID "${sso_integrator}" does not exist in the system.`);
        }
    }

    async validateUserInput({
        title, first_name, middle_name, last_name, dob, email, password, sso_integrator
    }) {
        await this.validateMandatoryFields(first_name, last_name, email);
        await this.validateFirstName(first_name);
        await this.validateLastName(last_name);
        await this.validateEmail(email);

        if (title !== null && title !== undefined) await this.validateTitle(title);
        if (middle_name != null && middle_name !== undefined) await this.validateMiddleName(middle_name);
        if (dob !== null && dob !== undefined) await this.validateDob(dob);
        if (sso_integrator !== null && sso_integrator !== undefined) {
            await this.validateSsoIntegrator(sso_integrator);
        } else {
            await this.validatePassword(password);
        }
    }
}

module.exports = UserValidator;
