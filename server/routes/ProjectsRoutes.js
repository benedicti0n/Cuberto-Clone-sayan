const express = require("express");
const multer = require("multer");
const { addProject, getAllProjects, deleteProject, updateProject } = require("../controllers/Project.controller");

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "_" + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// Route to handle form data and optional image file
router.post("/addProject", upload.single("imageFile"), addProject);
router.get("/getAll", getAllProjects)
router.delete("/delete/:id", deleteProject);
router.put("/update/:id", upload.single("imageFile"), updateProject);

module.exports = router;
