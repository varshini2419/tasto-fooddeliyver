const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Add a food item to a restaurant
// @route   POST /api/food-items
// @access  Private/Admin
const addFoodItem = async (req, res) => {
    try {
        const { restaurantId, name, price, image, isAvailable } = req.body;

        if (!restaurantId || !name || !price) {
            return res.status(400).json({ message: 'Please add restaurantId, name, and price' });
        }

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const foodItem = await FoodItem.create({
            restaurantId,
            name,
            price,
            image,
            isAvailable
        });

        res.status(201).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get food items for a specific restaurant
// @route   GET /api/food-items/restaurant/:restaurantId
// @access  Public
const getFoodItemsByRestaurant = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId });
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update food item
// @route   PUT /api/food-items/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedFoodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete food item
// @route   DELETE /api/food-items/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);

        if (!foodItem) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        await FoodItem.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addFoodItem,
    getFoodItemsByRestaurant,
    updateFoodItem,
    deleteFoodItem
};
