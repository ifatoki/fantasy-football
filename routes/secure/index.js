const express = require('express');
const {
  playerListingController,
  playerDelistingController,
  playerBuyingController
} = require('../../controllers/team');

const router = express.Router();

router.get('/users/:id', (req, res) => {
  res.status(200).send({ message: 'getting user' });
});

router.post('/players/:id/list', playerListingController);
router.put('/players/:id/buy', playerBuyingController);
router.put('/players/:id/delist', playerDelistingController);

module.exports = router;
