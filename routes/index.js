const express = require('express');
const publicRoutes = require('./public');
const secureRoutes = require('./secure');
const { injectMockUser } = require('../controllers/utils/Authentication');

const router = express.Router();

router.use(publicRoutes);
router.use(injectMockUser);
router.use(secureRoutes);

module.exports = router;
