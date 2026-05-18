import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

// Generate a signed JWT for the given user ID
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

// Register a new user — hashes password and returns JWT
export const register = async (req: Request, res: Response): Promise<void> => {
  console.log('[auth] Register request received');
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, and password are required' });
      return;
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email is already registered' });
      return;
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    console.log(`[auth] New user registered: ${user.email}`);

    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('[auth] Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login — validates credentials and returns JWT
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log('[auth] Login request received');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare plain password against stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log(`[auth] User logged in: ${user.email}`);
    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('[auth] Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get the current authenticated user's profile
export const getMe = async (req: Request & { userId?: string }, res: Response): Promise<void> => {
  console.log('[auth] Get current user request');
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('[auth] GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
