const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  radius: {
    type: Number,
    required: true, // Radius in meters
  },
});

const Geofence = mongoose.model('Geofence', geofenceSchema);

module.exports = Geofence;
