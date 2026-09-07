import { Router } from 'express';
import { getMe, updateMe } from '../controllers/user.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/me', getMe);
router.patch('/me', updateMe);

export default router;
