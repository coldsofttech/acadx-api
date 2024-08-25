const express = require('express');
const Pagination = require('./Pagination');
const SsoIntegrationService = require('../services/SsoIntegrationService');

const router = express.Router();
const pagination = new Pagination();
const ssoIntegrationService = new SsoIntegrationService();

router.get('/', async (req, res) => {
    try {
        const includeArchive = req.query.includeArchive === 'true';
        const includeAudit = req.query.includeAudit === 'true';
        const { parsedPage, parsedPageSize, baseUrl } = await pagination.parsePagination(req);
        const { ssoIntegrations, totalRecords } = await ssoIntegrationService.getSsoIntegrations(
            parsedPage, parsedPageSize, includeArchive, includeAudit
        );
        const { totalPages, next, prev } = await pagination.generatePagination(
            parsedPage, parsedPageSize, totalRecords, baseUrl, req
        );

        res.json({
            ssoIntegrations,
            totalRecords,
            totalPages,
            next,
            prev
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const includeAudit = req.query.includeAudit === 'true';
        const ssoIntegration = await ssoIntegrationService.getSsoIntegrationById(req.params.id, includeAudit);
        res.json(ssoIntegration);
    } catch (error) {
        if (error.message.includes('No data found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
