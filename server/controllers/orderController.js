const Order = require('../models/Order');
const Settings = require('../models/Settings');

// Helper to check portal status
const isPortalOpen = async () => {
    const settings = await Settings.findOne();
    return settings ? settings.isPortalOpen : false;
};

// Allowed pin codes for SRKR College Area
const ALLOWED_PIN_CODES = ['534204', '534201', '534202'];

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = async (req, res) => {
    try {
        const isOpen = await isPortalOpen();
        
        if (!isOpen) {
            return res.status(403).json({ 
                message: 'Deliveries are not being taken right now. Please contact 999999999.' 
            });
        }

        const { customerName, customerPhone, address, pinCode, items, totalAmount } = req.body;

        if (!ALLOWED_PIN_CODES.includes(pinCode)) {
            return res.status(400).json({ message: 'Delivery is not available in this area. We only deliver near SRKR College.' });
        }

        if (items && items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            customer: req.user._id,
            customerName,
            customerPhone,
            address,
            pinCode,
            items,
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in customer orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('deliveryBoy', 'name phone')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer', 'name phone')
            .populate('deliveryBoy', 'name phone')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pending orders
// @route   GET /api/orders/delivery/pending
// @access  Private/DeliveryBoy
const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Pending' })
            .sort({ createdAt: 1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept order
// @route   PUT /api/orders/:id/accept
// @access  Private/DeliveryBoy
const acceptOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Pending') {
            return res.status(400).json({ message: 'Order is no longer pending' });
        }

        order.status = 'Accepted';
        order.deliveryBoy = req.user._id;

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/DeliveryBoy
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify the delivery boy is the one assigned to this order
        if (order.deliveryBoy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not assigned to this order' });
        }

        if (!['Picked Up', 'Delivered'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active orders for logged in delivery boy
// @route   GET /api/orders/delivery/my-active-orders
// @access  Private/DeliveryBoy
const getMyActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            deliveryBoy: req.user._id,
            status: { $in: ['Accepted', 'Picked Up'] }
        }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stats for logged in delivery boy
// @route   GET /api/orders/delivery/stats
// @access  Private/DeliveryBoy
const getDeliveryStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const allMyOrders = await Order.find({ deliveryBoy: req.user._id });

        const completedToday = allMyOrders.filter(o => 
            o.status === 'Delivered' && new Date(o.updatedAt) >= today
        ).length;

        const activeOrders = allMyOrders.filter(o => 
            ['Accepted', 'Picked Up'].includes(o.status)
        ).length;

        const totalDelivered = allMyOrders.filter(o => o.status === 'Delivered').length;

        const totalAmountHandledToday = allMyOrders
            .filter(o => o.status === 'Delivered' && new Date(o.updatedAt) >= today)
            .reduce((acc, curr) => acc + curr.totalAmount, 0);

        res.status(200).json({
            completedToday,
            activeOrders,
            totalDelivered,
            totalAmountHandledToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getPendingOrders,
    acceptOrder,
    updateOrderStatus,
    getMyActiveOrders,
    getDeliveryStats
};
