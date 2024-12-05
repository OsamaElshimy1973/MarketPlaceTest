export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Try high accuracy first
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    // Fallback options with lower accuracy but higher timeout
    const fallbackOptions = {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 30000
    };

    const successCallback = (position: GeolocationPosition) => {
      if (!position || !position.coords) {
        reject(new Error('Unable to retrieve location data'));
        return;
      }
      resolve(position);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      // If high accuracy fails, try with lower accuracy
      if (error.code === error.TIMEOUT && error.message.includes('timeout')) {
        navigator.geolocation.getCurrentPosition(
          successCallback,
          (fallbackError) => {
            let errorMessage = 'Failed to get location: ';
            switch (fallbackError.code) {
              case fallbackError.PERMISSION_DENIED:
                errorMessage += 'Location permission denied. Please enable location services.';
                break;
              case fallbackError.POSITION_UNAVAILABLE:
                errorMessage += 'Location information is unavailable.';
                break;
              case fallbackError.TIMEOUT:
                errorMessage += 'Location request timed out. Please check your connection.';
                break;
              default:
                errorMessage += fallbackError.message || 'Unknown error occurred.';
            }
            reject(new Error(errorMessage));
          },
          fallbackOptions
        );
      } else {
        let errorMessage = 'Failed to get location: ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location permission denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please check your connection.';
            break;
          default:
            errorMessage += error.message || 'Unknown error occurred.';
        }
        reject(new Error(errorMessage));
      }
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      highAccuracyOptions
    );
  });
};

export const watchLocation = (
  onSuccess: (position: GeolocationPosition) => void,
  onError?: (error: GeolocationPositionError) => void
): () => void => {
  if (!navigator.geolocation) {
    onError?.(new Error('Geolocation is not supported') as GeolocationPositionError);
    return () => {};
  }

  const options = {
    enableHighAccuracy: false, // Use lower accuracy for continuous updates
    timeout: 10000,
    maximumAge: 30000 // Allow cached positions up to 30 seconds old
  };

  const watchId = navigator.geolocation.watchPosition(
    onSuccess,
    onError,
    options
  );

  return () => navigator.geolocation.clearWatch(watchId);
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Default locations for different regions
export const DEFAULT_LOCATIONS = {
  NEW_YORK: {
    latitude: 40.7128,
    longitude: -74.0060
  },
  LONDON: {
    latitude: 51.5074,
    longitude: -0.1278
  },
  TOKYO: {
    latitude: 35.6762,
    longitude: 139.6503
  }
};

export const getDefaultLocation = (): { latitude: number; longitude: number } => {
  // Try to get rough location from timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  if (timezone.includes('America')) {
    return DEFAULT_LOCATIONS.NEW_YORK;
  } else if (timezone.includes('Europe')) {
    return DEFAULT_LOCATIONS.LONDON;
  } else if (timezone.includes('Asia')) {
    return DEFAULT_LOCATIONS.TOKYO;
  }
  
  return DEFAULT_LOCATIONS.NEW_YORK;
};