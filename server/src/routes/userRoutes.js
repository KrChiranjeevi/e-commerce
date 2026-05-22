const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, getUsers, deleteUser, updateUserProfile, toggleWishlist } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/wishlist/:id').post(protect, toggleWishlist);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
