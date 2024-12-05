import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Navigation2 } from 'lucide-react';
import { User } from '../types';
import { MapController } from './map/MapController';
import { MapMarker } from './map/MapMarker';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  currentLocation: [number, number];
  selectedUser: User | null;
  nearbyUsers: (User & { distance: number })[];
  onUserSelect: (user: User) => void;
}

const MapView: React.FC<MapViewProps> = ({
  currentLocation,
  selectedUser,
  nearbyUsers,
  onUserSelect,
}) => {
  const mapRef = useRef<L.Map>(null);
  const [isFollowing, setIsFollowing] = useState(true);

  const handleMarkerClick = (user: User) => {
    onUserSelect(user);
    if (user.location && mapRef.current) {
      mapRef.current.setView(
        [user.location.latitude, user.location.longitude],
        15
      );
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing && mapRef.current) {
      mapRef.current.setView(currentLocation, mapRef.current.getZoom());
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={currentLocation}
        zoom={13}
        className="h-full w-full z-0"
        ref={mapRef}
        scrollWheelZoom={true}
      >
        <MapController center={isFollowing ? currentLocation : currentLocation} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Current user location */}
        <MapMarker
          user={{
            id: 'current',
            phoneNumber: '',
            role: 'You',
            location: {
              latitude: currentLocation[0],
              longitude: currentLocation[1]
            }
          }}
          onClick={() => {}}
        />

        {/* Nearby users */}
        {nearbyUsers.map((user) => (
          <MapMarker
            key={user.id}
            user={user}
            isSelected={user.id === selectedUser?.id}
            onClick={handleMarkerClick}
          />
        ))}
      </MapContainer>

      <button
        onClick={toggleFollow}
        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg z-[400] ${
          isFollowing ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
        }`}
        title={isFollowing ? 'Following your location' : 'Click to follow'}
      >
        <Navigation2 
          className={`w-6 h-6 ${isFollowing ? 'animate-pulse' : ''}`} 
        />
      </button>
    </div>
  );
};

export default MapView;