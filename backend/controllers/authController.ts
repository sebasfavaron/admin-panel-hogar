import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with UUID
    const user = await User.create({
      id: uuidv4(), // Generate a UUID for the user
      email,
      password,
      name,
      role: 'user', // Default role
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Error creating user',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });

    // Update last login
    await user.update({ lastLogin: new Date() });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Error logging in',
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Error fetching profile',
    });
  }
};
