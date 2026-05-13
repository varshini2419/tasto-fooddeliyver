const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please add a restaurant ID'],
        ref: 'Restaurant'
    },
    name: {
        type: String,
        required: [true, 'Please add a food item name']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        default: 'default-food.png'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
