import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { useUserStore } from '../store/userStore';
import { calculateDistance } from '../utils/location';
import { locationService, LocationResult } from '../services/LocationService';

interface LocationTrackingResult {
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  nearbyUsers: (User & { distance: number })[];
  error: string | null;
  loading: boolean;
}

export const useLocationTracking = (
  currentUser: User | null,
  userLimit: number = 10,
  updateInterval: number = 60000
): LocationTrackingResult => {
  const [currentLocation, setCurrentLocation] = useState<LocationResult['coords']>({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { users, updateUserLocation } = useUserStore();

  const handleLocationUpdate = useCallback((position: LocationResult) => {
    setCurrentLocation(position.coords);
    setError(null);
    setLoading(false);

    if (currentUser?.id) {
      updateUserLocation(
        currentUser.id,
        position.coords.latitude,
        position.coords.longitude
      );
    }
  }, [currentUser?.id, updateUserLocation]);

  const handleLocationError = useCallback((error: Error) => {
    console.error('Location error:', error.message);
    setError(error.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    const updateLocation = async () => {
      try {
        const position = await locationService.getCurrentPosition();
        handleLocationUpdate(position);
      } catch (error) {
        handleLocationError(error as Error);
      }
    };

    // Initial location update
    updateLocation();

    // Start watching location
    locationService.startWatching(handleLocationUpdate, handleLocationError);

    // Periodic updates as backup
    const intervalId = setInterval(updateLocation, updateInterval);

    return () => {
      locationService.stopWatching();
      clearInterval(intervalId);
    };
  }, [handleLocationUpdate, handleLocationError, updateInterval]);

  const nearbyUsers = users
    .filter(
      (user) =>
        user.role !== currentUser?.role &&
        user.location &&
        user.id !== currentUser?.id
    )
    .map((user) => ({
      ...user,
      distance: calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        user.location!.latitude,
        user.location!.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, userLimit);

  return {
    currentLocation,
    nearbyUsers,
    error,
    loading,
  };
};