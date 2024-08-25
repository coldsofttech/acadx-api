const express = require('express');
const Pagination = require('./Pagination');
const TitleService = require('../services/TitleService');

const router = express.Router();
const pagination = new Pagination();
const titleService = new TitleService();

router.get('/', async (req, res) => {
    try {
        const includeArchive = req.query.includeArchive === 'true';
        const includeAudit = req.query.includeAudit === 'true';
        const { parsedPage, parsedPageSize, baseUrl } = await pagination.parsePagination(req);
        const { titles, totalRecords } = await titleService.getTitles(
            parsedPage, parsedPageSize, includeArchive, includeAudit
        );
        const { totalPages, next, prev } = await pagination.generatePagination(
            parsedPage, parsedPageSize, totalRecords, baseUrl, req
        );
        
        res.json({
            titles,
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
        const title = await titleService.getTitleById(req.params.id, includeAudit);
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
