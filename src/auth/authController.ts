import { Request, Response } from 'express';
import User from '../user/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config as envConfig } from 'dotenv';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

envConfig();

const JWT_SECRET = process.env.JWT_KEY || 'your_jwt_secret';

// Zod schemas for input validation
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 8 characters long'),
  profilePhoto: z.string().url('Invalid URL format').optional(),
});

const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 8 characters long'),
});

// Rate limiter for login to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

// User login
export const loginUser = async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const { email, password } = loginUserSchema.parse(req.body);

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
    // Zod validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }

    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new user (sign up)
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validate the request body using Zod schema
    const { name, email, password, profilePhoto } = createUserSchema.parse(req.body);

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
    const user1=await newUser.save();
    console.log(user1)

    return res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    // Zod validation error
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }

    return res.status(500).json({ message: 'Server error', error });
  }
};

// Apply the rate limiter and other security measures to routes
export const applyRateLimiter = (app: any) => {
  app.post('/login', loginLimiter, loginUser);
};
