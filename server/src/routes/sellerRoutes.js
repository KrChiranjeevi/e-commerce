const express = require('express');
const router = express.Router();
const { authSeller, registerSeller, getSellerProfile } = require('../controllers/sellerController');
const { protectSeller } = require('../middleware/sellerAuthMiddleware');

router.post('/', registerSeller);
router.post('/login', authSeller);
router.route('/profile').get(protectSeller, getSellerProfile);

module.exports = router;
