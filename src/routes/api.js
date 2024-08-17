const express = require('express');
const router = express.Router();
const { getTitles } = require('../services/titles');
const SsoIntegration = require('../services/sso-integrations');

const ssoIntegration = new SsoIntegration();
router.get('/sso-integrations', async (req, res) => {
    try {
        const ssoData = await ssoIntegration.getSsoIntegrations();
        res.json(ssoData);
    } catch (error) {
        if (error.message.includes('exceeds the limit of 6')) {
            res.status(406).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.get('/titles', (req, res) => {
    const titles = getTitles();
    res.json(titles);
});

module.exports = router;
