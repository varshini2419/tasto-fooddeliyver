const express = require('express');
const router = express.Router();
const {
    addFoodItem,
    getFoodItemsByRestaurant,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodItemController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/restaurant/:restaurantId', getFoodItemsByRestaurant);

// Admin only routes
router.post('/', protect, admin, addFoodItem);
router.put('/:id', protect, admin, updateFoodItem);
router.delete('/:id', protect, admin, deleteFoodItem);

module.exports = router;
