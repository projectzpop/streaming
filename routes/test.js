const express = require('express');

const router = express.Router();
const testController = require('../controller/test');

router.post('/singqtank/*', testController);

// heart beating..
router.get('/singqtank/health', (req, res, next) => {
  res.send('OK');
});


module.exports = router;
