"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.isUsingMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
exports.isUsingMongo = false;
const connectDB = async () => {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_1.config.mongoUri, {
            serverSelectionTimeoutMS: 3000,
        });
        exports.isUsingMongo = true;
        console.log('⚡ Connected to MongoDB database successfully');
        return true;
    }
    catch (error) {
        console.warn('⚠️ Could not connect to local MongoDB. Operating in High-Speed Zero-Gravity Memory Store mode.');
        exports.isUsingMongo = false;
        return false;
    }
};
exports.connectDB = connectDB;
