const express = require('express');
const router = express.Router();
const { getTitles } = require('../services/titles');

router.get('/titles', (req, res) => {
    const titles = getTitles();
    res.json(titles);
});

module.exports = router;
