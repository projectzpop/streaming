const express = require('express');

const router = express.Router();
const testController = require('../controller/test');

/* GET home page. */
router.post('/singqtank/*', testController);


module.exports = router;