const express = require("express");
const { addProject, getAllProjects, deleteProject, updateProject } = require("../controllers/Project.controller");

const router = express.Router();

router.post("/addProject", addProject);
router.get("/getAll", getAllProjects);
router.delete("/delete/:id", deleteProject);
router.put("/update/:id", updateProject);

module.exports = router;
