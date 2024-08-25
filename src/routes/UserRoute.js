const express = require('express');
const Pagination = require('./Pagination');
const UserService = require('../services/UserService');

const router = express.Router();
const pagination = new Pagination();
const userService = new UserService();

router.get('/', async (req, res) => {
    try {
        const includeArchive = req.query.includeArchive === 'true';
        const includeAudit = req.query.includeAudit === 'true';
        const { parsedPage, parsedPageSize, baseUrl } = await pagination.parsePagination(req);
        const { users, totalRecords } = await userService.getUsers(
            parsedPage, parsedPageSize, includeArchive, includeAudit
        );
        const { totalPages, next, prev } = await pagination.generatePagination(
            parsedPage, parsedPageSize, totalRecords, baseUrl, req
        );

        res.json({
            users,
            totalRecords,
            totalPages,
            next,
            prev
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, first_name, middle_name, last_name, dob, email, password, sso_integrator } = req.body || {};
        const user = await userService.createUser(
            title, first_name, middle_name, last_name, dob, email, password, sso_integrator
        );
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const includeAudit = req.query.includeAudit === 'true';
        let user;

        if (req.params.id.includes('@')) {
            user = await userService.getUserByEmail(req.params.id, includeAudit);
        } else {
            user = await userService.getUserById(req.params.id, includeAudit);
        }
        
        res.json(user);
    } catch (error) {
        if (error.message.includes('No data found')) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const user = await userService.verifyLogin(email, password);
        res.status(200).json(user);
    } catch (error) {
        if (error.message.includes('No data found')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Invalid password')) {
            res.status(401).json({ error: error.message })
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
