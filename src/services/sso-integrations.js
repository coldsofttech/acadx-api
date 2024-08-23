require('dotenv').config();

const fs = require('fs');
const path = require('path');
const validator = require('validator');
const { get } = require('@fortawesome/fontawesome-svg-core');

class SsoIntegrationService {
    constructor() {
        this.configFilePath = path.join(__dirname, 'sso-config.json');
        this.ssoData = null;
    }

    isValidUrl(urlString) {
        return validator.isURL(urlString, { require_tld: false, allow_local: process.env.ENVIRONMENT !== 'prod' });
    } 

    async getValidIcons() {
        const icons = {
            ...require('@fortawesome/free-brands-svg-icons')
        };

        return new Set(Object.keys(icons));
    }

    async readConfigFile() {
        return new Promise(async (resolve, reject) => {
            fs.readFile(this.configFilePath, 'utf-8', async (err, data) => {
                if (err) {
                    return reject(new Error(`Unable to read configuration file. ${err}`));
                }

                try {
                    const parsedData = JSON.parse(data);

                    if (!Array.isArray(parsedData)) {
                        return reject(new Error('Configuration file should contain an array of SSO items.'));
                    }

                    if (parsedData.length > 6) {
                        return reject(new Error('The number of SSO items exceeds the limit of 6.'));
                    }

                    const validIcons = await this.getValidIcons();

                    parsedData.forEach((item, index) => {
                        if (typeof item.icon !== 'string' || !validIcons.has(item.icon)) {
                            return reject(new Error(`Invalid icon at index ${index}. Must be one of ${Array.from(validIcons).join(', ')}.`));
                        }

                        if (typeof item.name !== 'string' || item.name.trim() === '') {
                            return reject(new Error(`Invalid or missing name at index ${index}. It must be a non-empty string.`));
                        }

                        if (typeof item.placeholder !== 'string' || item.placeholder.trim() === '') {
                            return reject(new Error(`Invalid or missing placeholder at index ${index}. It must be a non-empty string.`));
                        }

                        const isValidUrl = this.isValidUrl(item.redirectUrl);

                        if (!isValidUrl) {
                            return reject(new Error(`Invalid redirectUrl at index ${index}. Must be a valid URL.`));
                        }
                    });

                    this.ssoData = parsedData;
                    resolve(this.ssoData);
                } catch (parseError) {
                    reject(new Error(`Error parsing configuration file. ${parseError}`));
                }
            });
        });
    }

    async getSsoIntegrations() {
        if (this.ssoData == null) { 
            await this.readConfigFile();
        }

        return this.ssoData;
    }
}

module.exports = SsoIntegrationService;
