import { Request, Response } from 'express';
import User from '../user/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config as envConfig } from 'dotenv';
import rateLimit from 'express-rate-limit';

envConfig();

const JWT_SECRET = process.env.JWT_KEY || 'your_jwt_secret';

// Rate limiter for login to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

// User login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new user (sign up)
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profilePhoto } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Apply the rate limiter to the login route
export const applyRateLimiter = (app: any) => {
  app.post('/login', loginLimiter, loginUser);
};
