// routes/expertise.route.js
const express = require('express');
const router = express.Router();
const {
    addExpertise,
    getAllExpertise,
    deleteExpertise,
    updateExpertise
} = require('../controllers/Expertise.controller');

router.post('/addExpertise', addExpertise);
router.get('/all', getAllExpertise);
router.delete('/:id', deleteExpertise);
router.put('/:id', updateExpertise);

module.exports = router;
