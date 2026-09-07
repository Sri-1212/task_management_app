"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMe = exports.getMe = void 0;
const data_service_1 = require("../services/data.service");
const getMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await data_service_1.dataService.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User profile not found' });
        }
        const userJson = typeof user.toJSON === 'function' ? user.toJSON() : user;
        return res.json(userJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to fetch user profile' });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, avatar } = req.body;
        const updated = await data_service_1.dataService.updateUser(userId, { name, avatar });
        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userJson = typeof updated.toJSON === 'function' ? updated.toJSON() : updated;
        return res.json(userJson);
    }
    catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to update user profile' });
    }
};
exports.updateMe = updateMe;
