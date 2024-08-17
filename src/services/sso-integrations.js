const fs = require('fs');
const path = require('path');

class SsoIntegration {
    constructor() {
        this.configFilePath = path.join(__dirname, 'sso-config.json');
        this.ssoData = null;
    }

    async readConfigFile() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.configFilePath, 'utf-8', (err, data) => {
                if (err) {
                    return reject(new Error(`Unable to read configuration file. ${err}`));
                }

                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.length > 6) {
                        return reject(new Error('The number of SSO items exceeds the limit of 6.'));
                    }

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

module.exports = SsoIntegration;