const prisma = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 1. New function to get list of hobbies for the dropdown
const getHobbies = async (req, res) => {
  try {
    const hobbies = await prisma.hobby.findMany({
      select: { name: true }
    });
    res.json(hobbies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hobbies" });
  }
};

// 2. Updated Register function
const registerUser = async (req, res) => {
  try {
    // added hobbyName to request body
    const { name, email, password, hobbyName } = req.body; 

    if (!name || !email || !password || !hobbyName) {
      return res.status(400).json({ error: "All fields including hobby are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- THE MAGIC PART ---
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username: `@${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`, // Auto-generate username
        hobbies: {
          connectOrCreate: {
            where: { name: hobbyName }, // Look for hobby with this name
            create: { name: hobbyName }, // If not found, create it
          },
        },
      },
      include: {
        hobbies: true // Return the hobbies in the response so we can see it worked
      }
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // --- GENERATE TOKEN ---
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "your_secret_key", // Use .env in production
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token, // Send the token to frontend
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getHobbies};