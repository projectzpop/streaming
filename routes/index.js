const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: '아직은 필요없지만 나중엔 무언가가 들어갈 것이다 데헷' });
});

module.exports = router;
