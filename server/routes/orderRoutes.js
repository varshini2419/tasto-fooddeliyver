const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getPendingOrders,
    acceptOrder,
    updateOrderStatus,
    getMyActiveOrders,
    getDeliveryStats
} = require('../controllers/orderController');
const { protect, admin, deliveryBoy } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);

// Delivery Boy routes
router.get('/delivery/pending', protect, deliveryBoy, getPendingOrders);
router.get('/delivery/my-active-orders', protect, deliveryBoy, getMyActiveOrders);
router.get('/delivery/stats', protect, deliveryBoy, getDeliveryStats);
router.put('/:id/accept', protect, deliveryBoy, acceptOrder);
router.put('/:id/status', protect, deliveryBoy, updateOrderStatus);

module.exports = router;
