const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch counts concurrently
        const [
            totalOrdersToday,
            revenueTodayResult,
            pendingOrders,
            acceptedOrders,
            deliveredOrders,
            totalDeliveryBoys,
            totalRestaurants,
            totalFoodItems
        ] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.aggregate([
                { $match: { createdAt: { $gte: today }, status: 'Delivered' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Order.countDocuments({ status: 'Pending' }),
            Order.countDocuments({ status: 'Accepted' }),
            Order.countDocuments({ status: 'Delivered' }),
            User.countDocuments({ role: 'delivery_boy' }),
            Restaurant.countDocuments({}),
            FoodItem.countDocuments({})
        ]);

        const totalRevenueToday = revenueTodayResult.length > 0 ? revenueTodayResult[0].total : 0;

        res.status(200).json({
            totalOrdersToday,
            totalRevenueToday,
            pendingOrders,
            acceptedOrders,
            deliveredOrders,
            totalDeliveryBoys,
            totalRestaurants,
            totalFoodItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create delivery boy
// @route   POST /api/admin/delivery-boys
// @access  Private/Admin
const createDeliveryBoy = async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Please provide name, phone, and password' });
        }

        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        const deliveryBoy = await User.create({
            name,
            phone,
            password,
            role: 'delivery_boy'
        });

        res.status(201).json({
            _id: deliveryBoy._id,
            name: deliveryBoy.name,
            phone: deliveryBoy.phone,
            role: deliveryBoy.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all delivery boys
// @route   GET /api/admin/delivery-boys
// @access  Private/Admin
const getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await User.find({ role: 'delivery_boy' }).select('-password');
        
        // We need to calculate completed deliveries for each
        const boysWithStats = await Promise.all(deliveryBoys.map(async (boy) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const allOrders = await Order.find({ deliveryBoy: boy._id, status: 'Delivered' });
            
            const completedToday = allOrders.filter(o => new Date(o.updatedAt) >= today).length;
            const totalCompleted = allOrders.length;

            return {
                ...boy._doc,
                completedToday,
                totalCompleted
            };
        }));

        res.status(200).json(boysWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete delivery boy
// @route   DELETE /api/admin/delivery-boys/:id
// @access  Private/Admin
const deleteDeliveryBoy = async (req, res) => {
    try {
        const boy = await User.findById(req.params.id);
        if (!boy || boy.role !== 'delivery_boy') {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        // Optional: Reset delivery boy field on pending/accepted orders? 
        // For simplicity, just delete user.
        res.status(200).json({ message: 'Delivery boy deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update delivery boy
// @route   PUT /api/admin/delivery-boys/:id
// @access  Private/Admin
const updateDeliveryBoy = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const boy = await User.findById(req.params.id);

        if (!boy || boy.role !== 'delivery_boy') {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }

        if (name) boy.name = name;
        if (phone) {
            // Check if another user has this phone number
            const phoneExists = await User.findOne({ phone, _id: { $ne: boy._id } });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone number is already in use by another account' });
            }
            boy.phone = phone;
        }

        await boy.save();

        res.status(200).json({
            _id: boy._id,
            name: boy.name,
            phone: boy.phone,
            role: boy.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    createDeliveryBoy,
    getDeliveryBoys,
    deleteDeliveryBoy,
    updateDeliveryBoy
};
