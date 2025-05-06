import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { verifyToken } from '@/lib/auth';

/**
 * Middleware to protect API routes by verifying JWT tokens and optionally enforcing role-based access.
 * @param allowedRoles Optional array of roles allowed to access the route (e.g., ['admin']).
 */
export function withAuth(allowedRoles: string[] = []) {
  return (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(401).json({ message: 'Invalid Token' });

      // Optional role-based check
      if (
        allowedRoles.length > 0 &&
        typeof decoded !== 'string' &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }

      (req as any).user = decoded;
      return handler(req, res);
    };
}
