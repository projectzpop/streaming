const express = require('express');

const router = express.Router();
const testController = require('../controller/test');

// heart beating..
router.get('/health', (req, res, next) => {
  console.log(req.headers.host);
  res.send('OK');
});

// Action Handler
router.post('/*', testController);


module.exports = router;
