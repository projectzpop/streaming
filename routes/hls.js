const express = require('express');
const controller = require('../controller/hls');

const router = express.Router();

router.get('/*', controller.example);

// router.get('/.ts', controller.getTs);
//
//
//
// router.get('/*', controller.getM3u8);

module.exports = router;
