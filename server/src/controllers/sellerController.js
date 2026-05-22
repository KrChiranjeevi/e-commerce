const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const Seller = require('../models/Seller');

// @desc    Auth seller & get token
// @route   POST /api/sellers/login
// @access  Public
const authSeller = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });

    if (seller && (await seller.matchPassword(password))) {
        res.json({
            _id: seller._id,
            name: seller.name,
            storeName: seller.storeName,
            email: seller.email,
            isSeller: seller.isSeller,
            token: generateToken(seller._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new seller
// @route   POST /api/sellers
// @access  Public
const registerSeller = asyncHandler(async (req, res) => {
    const { name, storeName, email, password } = req.body;

    const sellerExists = await Seller.findOne({ email });

    if (sellerExists) {
        res.status(400);
        throw new Error('Seller already exists');
    }

    const seller = await Seller.create({
        name,
        storeName,
        email,
        password,
    });

    if (seller) {
        res.status(201).json({
            _id: seller._id,
            name: seller.name,
            storeName: seller.storeName,
            email: seller.email,
            isSeller: seller.isSeller,
            token: generateToken(seller._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid seller data');
    }
});

// @desc    Get seller profile
// @route   GET /api/sellers/profile
// @access  Private
const getSellerProfile = asyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.seller._id);

    if (seller) {
        res.json({
            _id: seller._id,
            name: seller.name,
            storeName: seller.storeName,
            email: seller.email,
            isSeller: seller.isSeller,
        });
    } else {
        res.status(404);
        throw new Error('Seller not found');
    }
});

module.exports = { authSeller, registerSeller, getSellerProfile };
