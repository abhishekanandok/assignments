const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No auth token found, authorization denied' });

    try {
        const secret = process.env.JWT_SECRET || "default_jwt_secret_changeme";
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { authMiddleware, restrictTo };
