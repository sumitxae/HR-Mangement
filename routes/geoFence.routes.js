const express = require('express');
const { setGeofenceHandler, getGeofenceHandler } = require('../controllers/geofenceController');
const { isHR } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to set/update the geofence
router.post('/set', isHR, setGeofenceHandler);

// Route to get the current geofence location
router.get('/', getGeofenceHandler);

module.exports = router;
