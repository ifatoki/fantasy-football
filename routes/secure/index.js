const express = require('express');

const router = express.Router();

router.get('/users/:id', (req, res) => {
  res.status(200).send({ message: 'logged in' });
});

module.exports = router;
