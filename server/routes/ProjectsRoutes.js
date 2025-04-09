const express = require("express");
const Project = require("../models/ProjectSchema");
const User = require("../models/UserSchema");

const ProjectRouter = express.Router();

// Get All Projects
ProjectRouter.get("/all", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error("Fetch all projects error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create or Insert Project
ProjectRouter.post("/add", async (req, res) => {
  try {
    const { userId, ...projectData } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId in request" });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can add projects" });
    }

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    // Link the project to admin user
    user.projects.push(savedProject._id);
    await user.save();

    res.status(201).json({ success: true, data: savedProject });
  } catch (err) {
    console.error("Project creation error:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update Project
ProjectRouter.put("/update/:id", async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete Project and Unlink from Users
ProjectRouter.delete("/delete/:id", async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    // Remove reference from any user
    await User.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Project deleted and removed from users",
      });
  } catch (err) {
    console.error("Project deletion error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = ProjectRouter;
