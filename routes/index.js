const express = require('express');
const publicRoutes = require('./public');
const secureRoutes = require('./secure');
const { authenticate } = require('../controllers/utils/Authentication');

const router = express.Router();

router.use(publicRoutes);
router.use(authenticate);
router.use(secureRoutes);

module.exports = router;
