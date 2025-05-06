import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import connectToDatabase from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await connectToDatabase();

  const { name, email, password, role, status } = req.body;

  // Field-level validation
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long.' });
  }

  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) {
    return res.status(400).json({ message: 'A valid email is required.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const validRoles = ['admin', 'user'];
  if (!role || !validRoles.includes(role.toLowerCase())) {
    return res.status(400).json({ message: 'Role must be either "admin" or "user".' });
  }

  const validStatuses = ['active', 'inactive'];
  if (!status || !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ message: 'Status must be either "active" or "inactive".' });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use. Please login instead.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role.toLowerCase(),
      status: status.toLowerCase(),
    });

    await newUser.save();

    // Sign token
    const token = signToken({ id: newUser._id, role: newUser.role });

    return res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
}
