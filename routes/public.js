const express = require('express');
const { signUp, signIn } = require('../controllers/user');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const message = 'Welcome to the fantasy footbal';

  res.status(200).send({ message });
});

router.post('/login', signIn);

router.post('/signup', signUp);

module.exports = router;
