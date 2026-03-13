import { useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { foodResources, FoodResource } from '../data/mockData';
import { Filter, MapPin, Clock, AlertCircle } from 'lucide-react';

export function FoodResourceMap() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredResources = foodResources.filter((resource) => {
    if (selectedType !== 'all' && resource.type !== selectedType) return false;
    if (selectedStatus !== 'all' && resource.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Food Resource Map</h1>
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
          >
            <option value="all">All Types</option>
            <option value="pantry">Food Pantries</option>
            <option value="fridge">Community Fridges</option>
            <option value="meal-program">Meal Programs</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="stable">Stable</option>
            <option value="moderate">Moderate Demand</option>
            <option value="high-demand">High Demand</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-[600px]">
          <InteractiveMap resources={filteredResources} />
        </div>
      </div>

      {/* Resource List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">All Resources ({filteredResources.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-gray-900">{resource.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{resource.neighborhood}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{resource.avgWaitTime} min wait</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{resource.operatingHours}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      resource.status === 'stable'
                        ? 'bg-green-100 text-green-800'
                        : resource.status === 'moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {resource.status.replace('-', ' ')}
                  </span>
                  {resource.issues > 0 && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>{resource.issues} issues</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">{resource.reportsCount} reports</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
