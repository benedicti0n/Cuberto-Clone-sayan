const express = require('express');
const router = express.Router();

const getHeaderLine = require('../controllers/HeaderLine.controller');
const editHeaderLine = require('../controllers/HeaderLine.controller');

router.get('/getHeaderLine', getHeaderLine);
router.post('/editHeaderLine', editHeaderLine);

module.exports = router;
