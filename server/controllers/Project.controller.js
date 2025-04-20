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
        };

        // Handle image data
        if (imageUrl) {
            projectData.imageUrl = imageUrl;
            projectData.imageType = 'url';
        } else if (req.file) {
            // Make sure we have the file buffer
            if (!req.file.buffer) {
                return res.status(400).json({ message: "File buffer is missing" });
            }
            projectData.imageBuffer = req.file.buffer;
            projectData.imageFile = req.file.originalname;
            projectData.imageType = 'buffer';
        }

        const newProject = new Project(projectData);
        await newProject.save();

        // Don't send buffer data in response
        const responseProject = newProject.toObject();
        if (responseProject.imageBuffer) {
            // Convert buffer to base64 for preview
            responseProject.imageDataUrl = `data:${req.file.mimetype};base64,${responseProject.imageBuffer.toString('base64')}`;
            delete responseProject.imageBuffer;
        }

        return res.status(200).json({
            success: true,
            message: "Project added successfully",
            data: responseProject
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
        const projects = await Project.find()
            .lean(); // Convert to plain JS objects

        // Convert buffers to base64 data URLs for each project
        const processedProjects = projects.map(project => {
            if (project.imageBuffer) {
                // Assuming image/jpeg as default mime type, adjust if needed
                project.imageDataUrl = `data:image/jpeg;base64,${project.imageBuffer.toString('base64')}`;
                delete project.imageBuffer;
            }
            return project;
        });

        return res.status(200).json(processedProjects);
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
        const updateData = { ...req.body };

        // Handle image update
        if (updateData.imageUrl) {
            updateData.imageType = 'url';
            // Clear any existing buffer data
            updateData.imageBuffer = undefined;
            updateData.imageFile = undefined;
        } else if (req.file) {
            updateData.imageBuffer = req.file.buffer;
            updateData.imageFile = req.file.originalname;
            updateData.imageType = 'buffer';
            updateData.imageUrl = undefined;
        }

        const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
            new: true,
        }).lean(); // Convert to plain JS object

        if (updatedProject.imageBuffer) {
            // Convert buffer to base64 for preview
            updatedProject.imageDataUrl = `data:${req.file.mimetype};base64,${updatedProject.imageBuffer.toString('base64')}`;
            delete updatedProject.imageBuffer;
        }

        return res.status(200).json({
            success: true,
            message: "Project updated",
            data: updatedProject
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update project",
            error: error.message
        });
    }
};

module.exports = {
    addProject,
    getAllProjects,
    deleteProject,
    updateProject
};