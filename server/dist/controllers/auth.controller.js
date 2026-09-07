"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const data_service_1 = require("../services/data.service");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }
        const existingUser = await data_service_1.dataService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newUser = await data_service_1.dataService.createUser({
            name,
            email,
            passwordHash,
            role: role === 'admin' ? 'admin' : 'user',
        });
        const userJson = typeof newUser.toJSON === 'function' ? newUser.toJSON() : newUser;
        const tokenPayload = { userId: userJson.id, role: userJson.role };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await data_service_1.dataService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
        const tokenPayload = { userId: userJson.id, role: userJson.role };
        const accessToken = (0, jwt_1.generateAccessToken)(tokenPayload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
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
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Login failed' });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token missing' });
        }
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, jwt_1.generateAccessToken)({ userId: payload.userId, role: payload.role });
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        return res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};
exports.refresh = refresh;
const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await data_service_1.dataService.findUserByEmail(email);
        if (!user) {
            // Return success anyway for security
            return res.json({ message: 'Password reset link sent if account exists' });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour
        await data_service_1.dataService.updateUser(user.id || user._id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });
        console.log(`[MOCK EMAIL SERVICE] Password reset token for ${email}: ${resetToken}`);
        return res.json({
            message: 'Password reset link sent to email',
            mockResetToken: resetToken,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Forgot password failed' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }
        const user = await data_service_1.dataService.findUserByResetToken(token);
        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        await data_service_1.dataService.updateUser(user.id || user._id, {
            passwordHash,
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
        });
        return res.json({ message: 'Password has been reset successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Reset password failed' });
    }
};
exports.resetPassword = resetPassword;
