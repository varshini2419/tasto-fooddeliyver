const express = require('express');
const router = express.Router();
const {
    addRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

// Admin only routes
router.post('/', protect, admin, addRestaurant);
router.put('/:id', protect, admin, updateRestaurant);
router.delete('/:id', protect, admin, deleteRestaurant);

module.exports = router;
