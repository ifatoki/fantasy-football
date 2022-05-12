const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  const message = 'Welcome to the fantasy footbal';

  res.status(200).send({ message });
});

module.exports = router;
