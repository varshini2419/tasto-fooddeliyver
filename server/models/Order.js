const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: {
        type: String,
        required: [true, 'Please add customer name']
    },
    customerPhone: {
        type: String,
        required: [true, 'Please add customer phone']
    },
    address: {
        type: String,
        required: [true, 'Please add delivery address']
    },
    pinCode: {
        type: String,
        required: [true, 'Please add pin code']
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Picked Up', 'Delivered'],
        default: 'Pending'
    },
    deliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    paymentMethod: {
        type: String,
        enum: ['Cash on Delivery', 'Online'],
        default: 'Cash on Delivery'
    },
    estimatedDeliveryTime: {
        type: Date
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
