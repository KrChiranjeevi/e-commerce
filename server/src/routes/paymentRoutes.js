const express = require('express');
const router = express.Router();
const {
    createPaymentIntent,
    getStripeConfig,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/config').get(protect, getStripeConfig);
router.route('/create-payment-intent').post(protect, createPaymentIntent);

module.exports = router;
