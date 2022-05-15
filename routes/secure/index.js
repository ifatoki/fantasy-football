const express = require('express');
const {
  editPlayerController,
  playerGetController
} = require('../../controllers/player');
const {
  playerListingController,
  playerDelistingController,
  playerBuyingController,
  getTeamController,
  editTeamController
} = require('../../controllers/team');
const { transfersFetchController } = require('../../controllers/transfer');
const {
  getUserController
} = require('../../controllers/user');

const router = express.Router();

router.get('/user', getUserController);

router.get('/transfers', transfersFetchController);

router.get('/team', getTeamController);
router.put('/team/edit', editTeamController);

router.get('/players/:id', playerGetController);
router.post('/players/:id/list', playerListingController);
router.put('/players/:id/buy', playerBuyingController);
router.put('/players/:id/delist', playerDelistingController);
router.put('/players/:id/edit', editPlayerController);

module.exports = router;
