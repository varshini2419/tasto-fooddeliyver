const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    createDeliveryBoy,
    getDeliveryBoys,
    deleteDeliveryBoy,
    updateDeliveryBoy
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin); // Apply to all routes

router.get('/dashboard-stats', getDashboardStats);
router.post('/delivery-boys', createDeliveryBoy);
router.get('/delivery-boys', getDeliveryBoys);
router.delete('/delivery-boys/:id', deleteDeliveryBoy);
router.put('/delivery-boys/:id', updateDeliveryBoy);

module.exports = router;
