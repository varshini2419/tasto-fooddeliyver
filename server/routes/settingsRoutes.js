const express = require('express');
const router = express.Router();
const { getPortalStatus, togglePortalStatus } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/portal-status', getPortalStatus);
router.put('/portal-status', protect, admin, togglePortalStatus);

module.exports = router;
