const geolib = require('geolib');

// Function to check if a given location is within the geofence
const isWithinGeofence = (geofenceLocation, currentLocation, radius) => {

  const { latitude: fixLatitude, longitude: fixLongitude } = geofenceLocation;
  const { latitude, longitude } = currentLocation;
  
  // Calculate the distance between the geofence and the current location
  let distance;
  try {
    distance = geolib.getDistance(
      { latitude: fixLatitude, longitude: fixLongitude },
      { latitude, longitude }
    );
  } catch (error) {
    console.log(error);
    return Infinity;
  }
  console.log(distance, radius);

  return distance <= radius; // Check if the distance is less than or equal to the radius
};

module.exports = {
  isWithinGeofence,
};
