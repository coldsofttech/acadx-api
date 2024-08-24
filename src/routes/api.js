const express = require('express');
const router = express.Router();
const CookieService = require('../services/cookie');
const SsoIntegrationService = require('../services/sso-integrations');
const TitleService = require('../services/titles');

const cookieService = new CookieService();
router.get('/cookie', async (req, res) => {
    try {
        const cookieConsent = await cookieService.getCookie(req);
        res.json({ cookieConsent });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
router.post('/cookie', async (req, res) => {
    try {
        const { preference } = req.body;
        await cookieService.setCookie(res, preference);
        res.sendStatus(200);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const ssoIntegrationService = new SsoIntegrationService();
router.get('/sso-integrations', async (req, res) => {
    try {
        const ssoData = await ssoIntegrationService.getSsoIntegrations();
        res.json(ssoData);
    } catch (error) {
        if (error.message.includes('exceeds the limit of 6')) {
            res.status(406).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

const titleService = new TitleService();
router.get('/titles', async (req, res) => {
    try {
        const { include_archive, include_audit } = req.body || {};

        const titles = await titleService.getTitles(include_archive, include_audit);
        res.json(titles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/title/:id', async (req, res) => {
    try {
        const { include_audit } = req.body || {};

        const title = await titleService.getTitleById(req.params.id, include_audit);
        res.json(title);
    } catch (error) {
        if (error.message.includes('No data found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
