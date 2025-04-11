require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Import cors

const ProjectsRouter = require('./routes/ProjectsRoutes');
const headerLineRoutes = require('./routes/HeaderLineRoute');
const expertiseRoutes = require('./routes/Expertise.route');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Use cors middleware (allow all origins for now)
app.use(cors({
  origin: '*', // Or use specific origin like 'http://localhost:3000' for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// For parsing application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// ✅ Define Routes
app.use('/headerLine', headerLineRoutes);
app.use('/project', ProjectsRouter);
app.use('/expertise', expertiseRoutes);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
