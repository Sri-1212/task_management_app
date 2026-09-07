import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dataService } from '../services/data.service';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await dataService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await dataService.createUser({
      name,
      email,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user',
    });

    const userJson = typeof newUser.toJSON === 'function' ? newUser.toJSON() : newUser;
    const tokenPayload = { userId: userJson.id, role: userJson.role };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({
      message: 'Account created successfully',
      user: userJson,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await dataService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
    const tokenPayload = { userId: userJson.id, role: userJson.role };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: 'Login successful',
      user: userJson,
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({ userId: payload.userId, role: payload.role });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  return res.json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await dataService.findUserByEmail(email);
    if (!user) {
      // Return success anyway for security
      return res.json({ message: 'Password reset link sent if account exists' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await dataService.updateUser(user.id || (user as any)._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    console.log(`[MOCK EMAIL SERVICE] Password reset token for ${email}: ${resetToken}`);

    return res.json({
      message: 'Password reset link sent to email',
      mockResetToken: resetToken,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Forgot password failed' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    const user = await dataService.findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await dataService.updateUser(user.id || (user as any)._id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return res.json({ message: 'Password has been reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Reset password failed' });
  }
};
