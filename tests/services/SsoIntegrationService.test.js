const fs = require('fs');
const path = require('path');

const SsoIntegrationService = require('../../src/services/sso-integrations');
const testDataDir = path.join(__dirname, '../test-data');

describe('Functional', () => {
    let service;

    beforeEach(() => {
        service = new SsoIntegrationService();
    });

    test('GET /sso-integrations should read and validate a valid configuration file', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-valid.json'))
        );

        const integrations = await service.getSsoIntegrations();
        expect(integrations).toEqual([
            {
                icon: 'faGoogle',
                name: 'Google',
                placeholder: 'Enter Google URL',
                redirectUrl: 'https://www.google.com'
            },
            {
                icon: 'faFacebook',
                name: 'Facebook',
                placeholder: 'Enter Facebook URL',
                redirectUrl: 'https://www.facebook.com'
            }
        ]);
    });

    test('GET /sso-integrations should throw an error for invalid icon', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-invalid-icon.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('Invalid icon at index 0');
    });

    test('GET /sso-integrations should throw an error for invalid name', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-invalid-name.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('Invalid or missing name at index 0');
    });

    test('GET /sso-integrations should throw an error for invalid placeholder', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-invalid-placeholder.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('Invalid or missing placeholder at index 0');
    });

    test('GET /sso-integrations should throw an error for invalid redirectUrl', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-invalid-redirectUrl.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('Invalid redirectUrl at index 0');
    });

    test('GET /sso-integrations should throw an error if SSO items exceed limits', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-exceed-limits.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('The number of SSO items exceeds the limit of 6.');
    });

    test('GET /sso-integrations should throw an error for invalid JSON structure', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-invalid-json.json'))
        );

        await expect(service.getSsoIntegrations()).rejects.toThrow('Configuration file should contain an array of SSO items.');
    });
});

describe('Performance', () => {
    let service;

    beforeEach(() => {
        service = new SsoIntegrationService();
    });

    test('GET /sso-integrations should return response in less than 200ms', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-valid.json'))
        );

        const start = performance.now();
        await service.getSsoIntegrations();
        const end = performance.now();
        const duration = end - start;
        expect(duration).toBeLessThan(200);
    });
});

describe('Load', () => {
    let service;

    beforeEach(() => {
        service = new SsoIntegrationService();
    });

    test('GET /sso-integrations handle multiple concurrent requests', async () => {
        fs.writeFileSync(
            path.join(__dirname, '../../src/services/sso-config.json'),
            fs.readFileSync(path.join(testDataDir, 'sso-config-valid.json'))
        );

        const requests = []
        for (let i = 0; i < 1000; i++) {
            requests.push(service.getSsoIntegrations());
        }

        const responses = await Promise.all(requests);
        responses.forEach(integrations => {
            expect(integrations).toEqual([
                {
                    icon: 'faGoogle',
                    name: 'Google',
                    placeholder: 'Enter Google URL',
                    redirectUrl: 'https://www.google.com'
                },
                {
                    icon: 'faFacebook',
                    name: 'Facebook',
                    placeholder: 'Enter Facebook URL',
                    redirectUrl: 'https://www.facebook.com'
                }
            ]);
        });
    });
});