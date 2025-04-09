const express = require("express");
const User = require("../models/UserSchema");

const UserRouter = express.Router();

//Add New User
UserRouter.post("/users", async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ error: "User already exists with this email" });
    }

    const user = new User({ name, email, role: role?.toUpperCase() || "USER" });
    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Users
UserRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("projects"); // Populating project data
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User by ID (with populated projects)
UserRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("projects");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Users by Role
UserRouter.delete("/users/role/:role", async (req, res) => {
  const role = req.params.role.toUpperCase();
  try {
    const result = await User.deleteMany({ role });
    res.json({
      message: `${result.deletedCount} user(s) with role ${role} deleted.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = UserRouter;
