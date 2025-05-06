import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { withAuth } from '@/middleware/auth';
import bcrypt from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const users = await User.find().skip((page - 1) * limit).limit(limit);
    const total = await User.countDocuments();
    return res.status(200).json({ users, total });
  }

  if (req.method === 'POST') {
    const { name, email, password, role, status } = req.body;
    
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

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role, status });
    return res.status(201).json({ user: newUser });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(['admin'])(handler);
