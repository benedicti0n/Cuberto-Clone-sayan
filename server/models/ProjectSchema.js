const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    footerText: String,
    backgroundStyle: String,
    technologyStack: String,
    projectUrl: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
