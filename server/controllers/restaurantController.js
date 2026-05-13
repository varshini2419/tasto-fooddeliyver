const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Add a new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const addRestaurant = async (req, res) => {
    try {
        const { name, description, image, isOpen } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Please add a restaurant name' });
        }

        const restaurant = await Restaurant.create({
            name,
            description,
            image,
            isOpen
        });

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public (Customers/Delivery Boys)
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({});
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete restaurant (and its food items)
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Also delete all food items associated with this restaurant
        await FoodItem.deleteMany({ restaurantId: req.params.id });

        await Restaurant.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Restaurant and its food items deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
