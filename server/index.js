require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path'); // ✅ required for serving static files

const ProjectsRouter = require('./routes/ProjectsRoutes');
const headerLineRoutes = require('./routes/HeaderLineRoute');
const expertiseRoutes = require('./routes/Expertise.route');
const aboutRoutes = require('./routes/aboutRoutes');
const taglineRoutes = require("./routes/taglineRoutes");
const profilePhotoRoute = require('./routes/profilePhotoRoute');
const resumeRoutes = require('./routes/ResumeRoute');
const academicRoutes = require('./routes/AcademicRoutes')
const contactFormRoutes = require('./routes/contactFormRoute')

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS config
app.use(cors({
  origin: 'https://cuberto-clone-puce.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use('/headerLine', headerLineRoutes);
app.use('/project', ProjectsRouter);
app.use('/expertise', expertiseRoutes);
app.use('/verifiedManager', aboutRoutes);
app.use('/verifiedManager', taglineRoutes);
app.use('/profilePhoto', profilePhotoRoute);
app.use('/resume', resumeRoutes);
app.use('/academic', academicRoutes)
app.use('/contactForm', contactFormRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
