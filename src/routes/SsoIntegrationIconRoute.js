const express = require('express');
const SsoIntegrationIconService = require('../services/SsoIntegrationIconService');

const router = express.Router();
const ssoIntegrationIconService = new SsoIntegrationIconService();

router.get('/', async (req, res) => {
    const icons = await ssoIntegrationIconService.getIcons();
    res.json(icons);
});

module.exports = router;
