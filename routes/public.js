const express = require('express');
const {
  signUpController,
  signInController
} = require('../controllers/user');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const message = 'Welcome to the fantasy footbal';

  res.status(200).send({ message });
});

router.post('/login', signInController);

router.post('/signup', signUpController);

module.exports = router;
