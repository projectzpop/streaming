const express = require('express');

const router = express.Router();
const mealController = require('../controller/meal');

// heart beating..
router.get('/health', (req, res, next) => {
  console.log(req.headers.host);
  res.send('OK');
});

// Action Handler
router.post('/*', mealController);


module.exports = router;
