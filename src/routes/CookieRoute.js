const express = require('express');
const CookieService = require('../services/CookieService');

const router = express.Router();
const cookieService = new CookieService();

router.post('/', async (req, res) => {
    try {
        const { preference } = req.query;
        const cookie = await cookieService.setCookie(res, preference);
        res.status(201).json(cookie);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const cookie = await cookieService.getCookie(req);
        res.status(200).json(cookie);
    } catch (error) {
        if (error.includes('not found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
});

module.exports = router;
