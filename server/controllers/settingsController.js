const Settings = require('../models/Settings');

// Helper to get or create settings
const getSettingsDoc = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({ isPortalOpen: false });
    }
    return settings;
};

// @desc    Get portal status
// @route   GET /api/settings/portal-status
// @access  Public
const getPortalStatus = async (req, res) => {
    try {
        const settings = await getSettingsDoc();
        res.status(200).json({ isPortalOpen: settings.isPortalOpen });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle portal status
// @route   PUT /api/settings/portal-status
// @access  Private/Admin
const togglePortalStatus = async (req, res) => {
    try {
        const { isPortalOpen } = req.body;

        if (typeof isPortalOpen !== 'boolean') {
            return res.status(400).json({ message: 'isPortalOpen must be a boolean' });
        }

        const settings = await getSettingsDoc();
        settings.isPortalOpen = isPortalOpen;
        await settings.save();

        res.status(200).json({ 
            message: `Portal is now ${isPortalOpen ? 'OPEN' : 'CLOSED'}`,
            isPortalOpen: settings.isPortalOpen
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPortalStatus,
    togglePortalStatus
};
