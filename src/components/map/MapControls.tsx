import React, { useState } from 'react';
import { Navigation2 } from 'lucide-react';

interface MapControlsProps {
  mapRef: React.RefObject<L.Map>;
  currentLocation: [number, number];
}

export const MapControls: React.FC<MapControlsProps> = ({ mapRef, currentLocation }) => {
  const [isFollowing, setIsFollowing] = useState(true);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing && mapRef.current) {
      mapRef.current.setView(currentLocation, mapRef.current.getZoom());
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <button
        onClick={handleFollowToggle}
        className={`p-3 rounded-full shadow-lg ${
          isFollowing ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
        }`}
        title={isFollowing ? 'Following location' : 'Click to follow'}
      >
        <Navigation2 className={`w-6 h-6 ${isFollowing ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
};