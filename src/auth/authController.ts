import { Request, Response } from 'express';
import User from '../user/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config as envConfig } from 'dotenv';

envConfig()

const JWT_SECRET = process.env.JWT_KEY || 'your_jwt_secret';

// User login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;


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

    // Generate a JWT tokens
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new user (sign up)
export const createUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password, profilePhoto } = req.body;
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
  
      return res.status(201).json({ message: 'user created',user: newUser });
    } catch (error) {

      return res.status(500).json({ message: 'Server error', error });
    }
  };
  
