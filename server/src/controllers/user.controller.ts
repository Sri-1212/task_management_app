import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { dataService } from '../services/data.service';

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = await dataService.findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
    return res.json(userJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
  }
};

export const updateMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { name, avatar } = req.body;

    const updated = await dataService.updateUser(userId, { name, avatar });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userJson = typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
    return res.json(userJson);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to update user profile' });
  }
};
