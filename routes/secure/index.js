const express = require('express');
const { editPlayerController } = require('../../controllers/player');
const {
  playerListingController,
  playerDelistingController,
  playerBuyingController,
  getTeamController,
  editTeamController
} = require('../../controllers/team');
const {
  getUserController
} = require('../../controllers/user');

const router = express.Router();

router.get('/user', getUserController);

router.get('/team', getTeamController);
router.put('/team/edit', editTeamController);

router.post('/players/:id/list', playerListingController);
router.put('/players/:id/buy', playerBuyingController);
router.put('/players/:id/delist', playerDelistingController);
router.put('/players/:id/edit', editPlayerController);

module.exports = router;
