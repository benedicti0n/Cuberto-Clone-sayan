const express = require('express')
const multer = require('multer')
const ProfilePhoto = require('../models/ProfilePhoto')

const router = express.Router()

// Multer config: store file in memory buffer
const storage = multer.memoryStorage()
const upload = multer({ storage })

// GET: Retrieve the current profile photo
router.get('/get', async (req, res) => {
    try {
        const photoDoc = await ProfilePhoto.findOne().sort({ createdAt: -1 })

        if (!photoDoc) {
            return res.status(404).json({ message: 'No profile photo found' })
        }

        res.set('Content-Type', photoDoc.contentType)
        res.send(photoDoc.photo)
    } catch (err) {
        console.error('Error fetching photo:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

// POST: Upload a new profile photo (replaces the old one)
router.post('/addProfilePhoto', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No photo uploaded' })
    }

    try {
        // Remove previous photo
        await ProfilePhoto.deleteMany({})

        // Save new one
        const newPhoto = new ProfilePhoto({
            photo: req.file.buffer,
            contentType: req.file.mimetype,
        })

        await newPhoto.save()

        res.status(200).json({ message: 'Profile photo uploaded successfully' })
    } catch (err) {
        console.error('Error uploading photo:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

// DELETE: Delete the current profile photo
router.delete('/', async (req, res) => {
    try {
        await ProfilePhoto.deleteMany({})
        res.status(200).json({ message: 'Profile photo deleted successfully' })
    } catch (err) {
        console.error('Error deleting photo:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router
