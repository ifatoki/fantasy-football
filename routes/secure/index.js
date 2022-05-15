const express = require('express');
const {
  playerListingController,
  playerDelistingController,
  playerBuyingController,
  getTeamController
} = require('../../controllers/team');
const { getUserController } = require('../../controllers/user');

const router = express.Router();

router.get('/user', getUserController);
router.get('/team', getTeamController);

router.post('/players/:id/list', playerListingController);
router.put('/players/:id/buy', playerBuyingController);
router.put('/players/:id/delist', playerDelistingController);

module.exports = router;
