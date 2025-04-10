const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    footerText: String,
    techStack: String,
    technologiesUsed: String,
    projectUrl: String,
    imageUrl: String, // Can be URL or local path to uploaded image
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
