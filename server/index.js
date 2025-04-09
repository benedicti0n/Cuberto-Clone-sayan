require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const ProjectRouter = require('./routes/ProjectsRoutes')
const UserRouter = require('./routes/UserRoutes')

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI //"mongodb://localhost:27017/userdb"; // Replace with your URI

app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});


app.use('/projects', ProjectRouter);
app.use('/user', UserRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
