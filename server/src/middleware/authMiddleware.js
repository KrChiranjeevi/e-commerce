const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Seller = require('../models/Seller');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_123456');
            console.log(`[Auth] Verifying token for ID: ${decoded.id}`);

            // Try to find user in User collection
            let user = await User.findById(decoded.id).select('-password');

            if (user) {
                console.log(`[Auth] Found in User collection: ${user._id}`);
            } else {
                console.log(`[Auth] Not found in User collection. Checking Seller collection...`);
                // If not found in User, try Seller collection
                const seller = await Seller.findById(decoded.id).select('-password');

                if (seller) {
                    console.log(`[Auth] Found in Seller collection: ${seller._id}`);
                    // Normalize seller to look like user for consistency
                    user = {
                        _id: seller._id,
                        name: seller.name,
                        email: seller.email,
                        isAdmin: false,
                        isSeller: true, // Force true from schema
                        storeName: seller.storeName
                    };
                } else {
                    console.log(`[Auth] Not found in Seller collection either.`);
                }
            }

            if (!user) {
                console.error('[Auth] Failed to find owner of token:', decoded.id);
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('[Auth] Token verification failed:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed: ' + error.message);
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
