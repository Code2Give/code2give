import { useState } from 'react';
import { FoodResource } from '../data/mockData';
import { X, MapPin, Clock, AlertCircle } from 'lucide-react';

interface InteractiveMapProps {
  resources: FoodResource[];
  onResourceClick?: (resource: FoodResource) => void;
}

export function InteractiveMap({ resources, onResourceClick }: InteractiveMapProps) {
  const [selectedResource, setSelectedResource] = useState<FoodResource | null>(null);

  const getStatusColor = (status: FoodResource['status']) => {
    switch (status) {
      case 'stable':
        return '#2E7D32';
      case 'moderate':
        return '#FF8F00';
      case 'high-demand':
        return '#d32f2f';
      default:
        return '#42A5F5';
    }
  };

  const getResourceTypeLabel = (type: FoodResource['type']) => {
    switch (type) {
      case 'pantry':
        return 'Food Pantry';
      case 'fridge':
        return 'Community Fridge';
      case 'meal-program':
        return 'Meal Program';
      default:
        return type;
    }
  };

  const handleMarkerClick = (resource: FoodResource) => {
    setSelectedResource(resource);
    onResourceClick?.(resource);
  };

  return (
    <div className="relative w-full h-full bg-[#E8F5E9] rounded-lg overflow-hidden">
      {/* Map SVG */}
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Grid pattern for map background */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c8e6c9" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="600" fill="url(#grid)" />

        {/* Simplified city areas */}
        <path
          d="M 100 100 L 300 80 L 350 200 L 200 250 Z"
          fill="#2E7D32"
          fillOpacity="0.1"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M 400 150 L 600 120 L 650 300 L 450 320 Z"
          fill="#FF8F00"
          fillOpacity="0.1"
          stroke="#FF8F00"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M 150 350 L 350 330 L 400 500 L 200 520 Z"
          fill="#42A5F5"
          fillOpacity="0.1"
          stroke="#42A5F5"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M 450 380 L 700 350 L 720 550 L 500 580 Z"
          fill="#2E7D32"
          fillOpacity="0.1"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeOpacity="0.3"
        />

        {/* Resource markers */}
        {resources.map((resource, index) => {
          const x = 100 + (index * 120) + (index % 2 === 0 ? 50 : 0);
          const y = 150 + Math.floor(index / 3) * 150 + (index % 3 === 1 ? 50 : 0);
          const color = getStatusColor(resource.status);

          return (
            <g
              key={resource.id}
              transform={`translate(${x}, ${y})`}
              onClick={() => handleMarkerClick(resource)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {/* Pulse animation for high-demand */}
              {resource.status === 'high-demand' && (
                <circle
                  r="20"
                  fill={color}
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              {/* Marker pin */}
              <circle r="12" fill={color} stroke="white" strokeWidth="3" />
              <circle r="5" fill="white" />
            </g>
          );
        })}
      </svg>

      {/* Detail Panel */}
      {selectedResource && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-gray-900">{selectedResource.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {getResourceTypeLabel(selectedResource.type)}
              </p>
            </div>
            <button
              onClick={() => setSelectedResource(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{selectedResource.neighborhood}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Avg Wait: {selectedResource.avgWaitTime} min
              </span>
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle
                className="w-4 h-4"
                style={{ color: getStatusColor(selectedResource.status) }}
              />
              <span
                className="text-sm capitalize"
                style={{ color: getStatusColor(selectedResource.status) }}
              >
                {selectedResource.status.replace('-', ' ')}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Operating Hours</p>
              <p className="text-sm text-gray-700 mt-1">{selectedResource.operatingHours}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Reports</p>
              <p className="text-sm text-gray-700 mt-1">{selectedResource.reportsCount} community reports</p>
            </div>

            {selectedResource.issues > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  {selectedResource.issues} active issue{selectedResource.issues > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
        <p className="text-xs text-gray-600 mb-2">Status</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2E7D32]" />
            <span className="text-xs text-gray-700">Stable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF8F00]" />
            <span className="text-xs text-gray-700">Moderate Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d32f2f]" />
            <span className="text-xs text-gray-700">High Demand</span>
          </div>
        </div>
      </div>
    </div>
  );
}
