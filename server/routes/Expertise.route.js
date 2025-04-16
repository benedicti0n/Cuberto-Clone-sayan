// routes/expertise.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    addExpertise,
    getAllExpertise,
    deleteExpertise,
    updateExpertise
} = require('../controllers/Expertise.controller');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Handle file upload errors
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
        return res.status(400).json({ message: 'Error processing file', error: err.message });
    }
    next();
};

router.post('/addExpertise', upload.single('image'), handleUploadError, addExpertise);
router.get('/all', getAllExpertise);
router.delete('/:id', deleteExpertise);
router.put('/:id', updateExpertise);

module.exports = router;
