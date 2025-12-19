import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TalentProfile } from '../../../core/domain/entities';
import { useNavigate } from 'react-router-dom';
import { RatingStars } from './RatingStars';
import { cn } from '../../lib/utils';
import { getInitials } from '../../utils/stringUtils';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TalentMapProps {
  talents: TalentProfile[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Component to update map view when center changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component for talent popup content with image error handling
function TalentPopupContent({ talent, onViewProfile }: { talent: TalentProfile; onViewProfile: () => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-2 min-w-[250px]">
      {/* Profile Image */}
      {talent.profileImageUrl && talent.profileImageUrl.trim() !== '' && !imageError ? (
        <img
          src={talent.profileImageUrl}
          alt={talent.fullName}
          className="w-full h-32 object-cover rounded-lg mb-3"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-lg mb-3">
          <span className="text-4xl font-bold text-white/30">{getInitials(talent.fullName)}</span>
        </div>
      )}

      {/* Name */}
      <h3 className="font-bold text-lg mb-1">{talent.fullName}</h3>

      {/* Location */}
      {talent.location.city && talent.location.country && (
        <p className="text-sm text-gray-600 mb-2">
          📍 {talent.location.city}, {talent.location.country}
        </p>
      )}

      {/* Rating */}
      {talent.averageRating !== null && talent.totalRatings !== null && (
        <div className="flex items-center gap-2 mb-2">
          <RatingStars rating={talent.averageRating} size="sm" />
          <span className="text-sm text-gray-600">
            ({talent.totalRatings})
          </span>
        </div>
      )}

      {/* Tier */}
      {talent.tier && (
        <span
          className={cn(
            'inline-block px-2 py-1 rounded text-xs font-semibold mb-2',
            talent.tier === 'PREMIUM' &&
              'bg-purple-100 text-purple-800',
            talent.tier === 'GOLD' && 'bg-yellow-100 text-yellow-800',
            talent.tier === 'SILVER' && 'bg-gray-200 text-gray-800',
            talent.tier === 'BRONZE' && 'bg-orange-100 text-orange-800'
          )}
        >
          {talent.tier} TIER
        </span>
      )}

      {/* Bio Preview */}
      {talent.bio && (
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {talent.bio}
        </p>
      )}

      {/* View Profile Link */}
      <button
        onClick={onViewProfile}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        View Profile
      </button>
    </div>
  );
}

export const TalentMap = ({
  talents,
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 10,
  className,
}: TalentMapProps) => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);

  // Filter talents that have location coordinates
  const talentsWithLocation = talents.filter(
    (talent) =>
      talent.location.latitude !== null &&
      talent.location.longitude !== null
  );

  // Adjust map bounds to fit all markers
  useEffect(() => {
    if (mapRef.current && talentsWithLocation.length > 0) {
      const bounds = L.latLngBounds(
        talentsWithLocation.map((talent) => [
          Number(talent.location.latitude),
          Number(talent.location.longitude),
        ])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [talentsWithLocation]);

  const handleMarkerClick = (talentId: string) => {
    navigate(`/talents/${talentId}`);
  };

  return (
    <div className={cn('relative', className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-[600px] rounded-lg shadow-lg z-0"
        ref={mapRef}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {talentsWithLocation.map((talent) => (
          <Marker
            key={talent.talentProfileId}
            position={[
              Number(talent.location.latitude),
              Number(talent.location.longitude),
            ]}
            eventHandlers={{
              click: () => handleMarkerClick(talent.talentProfileId),
            }}
          >
            <Popup>
              <TalentPopupContent
                talent={talent}
                onViewProfile={() => handleMarkerClick(talent.talentProfileId)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Talents count indicator */}
      {talentsWithLocation.length > 0 && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md z-[1000]">
          <p className="text-sm font-medium text-gray-900">
            {talentsWithLocation.length} talent{talentsWithLocation.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {talentsWithLocation.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg z-[1000]">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-600 font-medium">No talents with locations found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
