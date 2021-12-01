"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncVerify = async (token) => {
    const promise = new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
    return await promise;
};
function generateAccessToken(params) {
    return jsonwebtoken_1.default.sign(params, process.env.JWT_SECRET);
}
exports.generateAccessToken = generateAccessToken;
async function authenticateToken(req, res, next) {
    const token = req.cookies["jwt"];
    if (!token) {
        req.currentUser = {
            user: undefined,
            role: undefined
        };
    }
    else {
        const data = await asyncVerify(token);
        req.currentUser = data;
    }
    next();
}
exports.authenticateToken = authenticateToken;
async function authorizeAdmin(req, res, next) {
    if (!req.currentUser?.role) {
        const token = req.cookies["jwt"];
        if (!token) {
            return res.status(403);
        }
        const data = await asyncVerify(token);
        req.currentUser = data;
    }
    if (req.currentUser.role !== "admin") {
        return res.status(404);
    }
    return next();
}
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=jwt.js.map