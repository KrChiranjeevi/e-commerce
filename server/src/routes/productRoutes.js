const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { protectSeller } = require('../middleware/sellerAuthMiddleware');
const { seller } = require('../middleware/sellerMiddleware'); // Legacy, can remove later if fully switched
router.route('/').get(getProducts).post(protectSeller, createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router
    .route('/:id')
    .get(getProductById)
    .delete(protectSeller, deleteProduct)
    .put(protectSeller, updateProduct);

module.exports = router;
