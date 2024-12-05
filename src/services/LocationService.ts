import { DEFAULT_LOCATIONS } from '../utils/location';

export interface LocationResult {
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  timestamp: number;
}

class LocationService {
  private static instance: LocationService;
  private lastKnownPosition: LocationResult | null = null;
  private watchId: number | null = null;
  private retryAttempts = 0;
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  private getLocationOptions(highAccuracy: boolean): PositionOptions {
    return {
      enableHighAccuracy: highAccuracy,
      timeout: highAccuracy ? 5000 : 15000,
      maximumAge: highAccuracy ? 0 : 30000,
    };
  }

  async getCurrentPosition(): Promise<LocationResult> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }

    try {
      // Try high accuracy first
      const position = await this.attemptGetPosition(true);
      this.lastKnownPosition = position;
      this.retryAttempts = 0;
      return position;
    } catch (error) {
      // If high accuracy fails, try with lower accuracy
      try {
        const position = await this.attemptGetPosition(false);
        this.lastKnownPosition = position;
        this.retryAttempts = 0;
        return position;
      } catch (fallbackError) {
        // If we have a last known position, use it
        if (this.lastKnownPosition) {
          return this.lastKnownPosition;
        }

        // If all else fails, use default location based on timezone
        const defaultLocation = this.getDefaultLocation();
        return {
          coords: {
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            accuracy: 5000, // Low accuracy for default location
          },
          timestamp: Date.now(),
        };
      }
    }
  }

  private attemptGetPosition(highAccuracy: boolean): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            },
            timestamp: position.timestamp,
          });
        },
        (error) => {
          this.retryAttempts++;
          if (this.retryAttempts < this.maxRetries) {
            reject(new Error('Retrying location...'));
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
        },
        this.getLocationOptions(highAccuracy)
      );
    });
  }

  startWatching(
    onSuccess: (position: LocationResult) => void,
    onError?: (error: Error) => void
  ): void {
    if (!navigator.geolocation) {
      onError?.(new Error('Geolocation is not supported by your browser'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const result: LocationResult = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          timestamp: position.timestamp,
        };
        this.lastKnownPosition = result;
        onSuccess(result);
      },
      (error) => {
        // If watch fails, fall back to last known position
        if (this.lastKnownPosition) {
          onSuccess(this.lastKnownPosition);
        } else {
          onError?.(new Error('Failed to watch location'));
        }
      },
      this.getLocationOptions(false)
    );
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private getDefaultLocation() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    if (timezone.includes('America')) {
      return DEFAULT_LOCATIONS.NEW_YORK;
    } else if (timezone.includes('Europe')) {
      return DEFAULT_LOCATIONS.LONDON;
    } else if (timezone.includes('Asia')) {
      return DEFAULT_LOCATIONS.TOKYO;
    }
    
    return DEFAULT_LOCATIONS.NEW_YORK;
  }
}

export const locationService = LocationService.getInstance();