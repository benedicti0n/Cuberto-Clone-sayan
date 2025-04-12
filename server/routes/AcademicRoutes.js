const express = require('express')
const router = express.Router()
const multer = require('multer')
const AcademicResult = require('../models/AcademicResultModel')

const storage = multer.memoryStorage()
const upload = multer({ storage })

// Add result
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const { title } = req.body
        const file = req.file

        if (!file) return res.status(400).json({ error: 'File is required' })

        const result = new AcademicResult({
            title,
            file: {
                data: file.buffer,
                contentType: file.mimetype
            }
        })

        await result.save()
        res.status(201).json({ message: 'Result added successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete result
router.delete('/delete/:id', async (req, res) => {
    try {
        await AcademicResult.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Result deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})


// Edit result
router.put('/edit/:id', upload.single('file'), async (req, res) => {
    try {
        const { title } = req.body
        const file = req.file

        const update = { title }

        if (file) {
            update.file = {
                data: file.buffer,
                contentType: file.mimetype
            }
        }

        await AcademicResult.findByIdAndUpdate(req.params.id, update)
        res.status(200).json({ message: 'Result updated successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        // Fetch all academic results with title, contentType, and file buffer
        const results = await AcademicResult.find({});

        // Transform results to include the file's type (image or pdf) and file buffer
        const resultsWithFileData = await Promise.all(
            results.map(async (result) => {
                // Read file as buffer (or file URL if using a file storage service)
                const fileBuffer = result.file?.data ? result.file.data.toString('base64') : null;
                const fileUrl = result.file?.url || null; // If you're storing files on a cloud storage, use the URL

                return {
                    title: result.title,
                    contentType: result.file?.contentType,
                    fileBuffer: fileBuffer, // base64 encoded buffer for front-end use
                    fileUrl: fileUrl, // file URL if using cloud storage
                    _id: result._id,
                };
            })
        );

        res.json(resultsWithFileData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch academic results.' });
    }
});


module.exports = router
