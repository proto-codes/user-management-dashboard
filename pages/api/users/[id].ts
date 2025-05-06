import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { Types } from 'mongoose';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  const { id } = req.query;

  if (!Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  // Only admins or the user themselves can view this data
  if (req.method === 'GET') {
    if (decoded.role !== 'admin' && decoded.id !== id) {
      return res.status(403).json({ message: 'Forbidden: Not your profile' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  }

  // Only admin can update or delete
  if (req.method && ['PUT', 'DELETE'].includes(req.method)) {
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.method === 'PUT') {
      const { name, email, role, status } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.status = status || user.status;

      await user.save();
      return res.status(200).json({ user });
    }

    if (req.method === 'DELETE') {
      await user.deleteOne();
      return res.status(200).json({ message: 'User deleted' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default handler;
