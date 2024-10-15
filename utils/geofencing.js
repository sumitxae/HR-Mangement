const geolib = require('geolib');

// Function to check if a given location is within the geofence
const isWithinGeofence = (geofenceLocation, currentLocation, radius) => {
  const geofenceCoordinates = {
    latitude: geofenceLocation.coordinates[1],
    longitude: geofenceLocation.coordinates[0],
  };

  // Calculate the distance between the geofence and the current location
  const distance = geolib.getDistance(geofenceCoordinates, currentLocation);

  return distance <= radius; // Check if the distance is less than or equal to the radius
};

module.exports = {
  isWithinGeofence,
};
