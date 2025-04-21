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

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const projectData = {
            title,
            description,
            footerText,
            techStack,
            technologiesUsed,
            projectUrl,
            imageUrl
        };

        const newProject = new Project(projectData);
        await newProject.save();

        return res.status(200).json({
            success: true,
            message: "Project added successfully",
            data: newProject
        });
    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add project",
            error: error.message
        });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();
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
        const {
            title,
            description,
            footerText,
            techStack,
            technologiesUsed,
            projectUrl,
            imageUrl,
        } = req.body;

        const projectData = {
            title,
            description,
            footerText,
            techStack,
            technologiesUsed,
            projectUrl,
            imageUrl
        };

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            projectData,
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });
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