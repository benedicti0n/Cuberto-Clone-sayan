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
    imageUrl: String,
    imageFile: String,
    imageBuffer: Buffer,
    imageType: {
      type: String,
      enum: ['url', 'buffer'],
      default: 'url'
    }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
