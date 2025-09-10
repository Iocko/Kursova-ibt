import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  let user;
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const JWT_SECRET = "super-secret-jwt-key-123456789";
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    // If user was created but token generation failed, return success
    if (user) {
      return res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name },
        token: null,
      });
    }
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", { email: req.body.email });
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user ? "yes" : "no");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch ? "yes" : "no");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const JWT_SECRET = "super-secret-jwt-key-123456789";
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, currentPassword, password } = req.body;
    const userId = req.userId!;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If trying to change password, verify current password
    if (password) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
    }

    // Update user
    const updateData: any = {};
    if (name) updateData.name = name;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export { router };
