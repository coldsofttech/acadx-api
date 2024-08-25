const express = require('express');
const router = express.Router();

router.use('/cookie', require('./CookieRoute'));
router.use('/ssoicons', require('./SsoIntegrationIconRoute'));
router.use('/ssointegrations', require('./SsoIntegrationRoute'));
router.use('/titles', require('./TitleRoute'));
router.use('/users', require('./UserRoute'));

module.exports = router;
