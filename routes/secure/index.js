const express = require('express');
const {
  playerListingController,
  playerDelistingController,
  playerBuyingController
} = require('../../controllers/team');
const { getUserHandler } = require('../../controllers/user');

const router = express.Router();

router.get('/user', getUserHandler);

router.post('/players/:id/list', playerListingController);
router.put('/players/:id/buy', playerBuyingController);
router.put('/players/:id/delist', playerDelistingController);

module.exports = router;
