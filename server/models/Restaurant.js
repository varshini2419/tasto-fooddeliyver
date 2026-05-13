const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a restaurant name']
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: 'default-restaurant.png'
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String }
    }],
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
