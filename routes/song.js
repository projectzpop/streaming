const express = require('express');

const router = express.Router();
const songController = require('../controller/song');

// heart beating..
router.get('/health', (req, res, next) => {
  console.log(req.headers.host);
  res.send('OK');
});

// Action Handler
router.post('/*', songController);


module.exports = router;
