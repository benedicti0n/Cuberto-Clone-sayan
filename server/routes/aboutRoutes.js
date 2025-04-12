// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();

const {
    fetchAbout,
    saveAbout,
} = require('../controllers/aboutController');

router.get('/fetchAbout', fetchAbout);
router.post('/saveAbout', saveAbout);

module.exports = router;
