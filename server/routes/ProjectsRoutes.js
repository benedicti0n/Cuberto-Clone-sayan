const express = require("express");
const multer = require("multer");
const { addProject, getAllProjects, deleteProject, updateProject } = require("../controllers/Project.controller");

const router = express.Router();

// Configure multer for memory storage (for buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Route to handle form data and optional image file
router.post("/addProject", upload.single("image"), addProject);
router.get("/getAll", getAllProjects)
router.delete("/delete/:id", deleteProject);
router.put("/update/:id", upload.single("image"), updateProject);

module.exports = router;
