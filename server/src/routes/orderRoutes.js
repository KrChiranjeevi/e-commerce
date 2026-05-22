const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    getSellerOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const { protectSeller } = require('../middleware/sellerAuthMiddleware');

router.route('/seller').get(protect, getSellerOrders);
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, protectSeller, updateOrderToDelivered);

module.exports = router;
