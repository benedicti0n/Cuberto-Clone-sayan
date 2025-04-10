const Project = require("../models/ProjectSchema");

const addProject = async (req, res) => {
    try {
        const {
            title,
            description,
            footerText,
            techStack,
            technologiesUsed,
            projectUrl,
            imageUrl,
        } = req.body;

        let uploadedImagePath = null;

        if (req.file) {
            uploadedImagePath = `/uploads/${req.file.filename}`;
        }

        const newProject = new Project({
            title,
            description,
            footerText,
            techStack,
            technologiesUsed,
            projectUrl,
            imageUrl: uploadedImagePath || imageUrl,
        });

        await newProject.save();

        return res.status(200).json({ message: "Project added successfully", data: newProject });
    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json({ message: "Failed to add project" });
    }
};


const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }); // newest first
        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: "Failed to fetch projects" });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ message: "Failed to delete project" });
    }
};

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = req.body;
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return res.status(200).json({ message: "Project updated", data: updatedProject });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: "Failed to update project" });
    }
};


module.exports = {
    addProject,
    getAllProjects,
    deleteProject,
    updateProject
};