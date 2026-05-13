const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    isPortalOpen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
