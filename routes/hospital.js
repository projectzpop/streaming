const express = require('express');

const router = express.Router();
const hosController = require('../controller/hospital');

// heart beating..
router.get('/health', (req, res, next) => {
  console.log(req.headers.host);
  res.send('OK');
});

// Action Handler
router.post('/*', hosController);


module.exports = router;
