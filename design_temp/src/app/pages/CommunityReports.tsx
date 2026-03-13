import { useState } from 'react';
import { ReportCard } from '../components/ReportCard';
import { communityReports, foodResources } from '../data/mockData';
import { Filter, Search } from 'lucide-react';

export function CommunityReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');

  const neighborhoods = Array.from(new Set(foodResources.map((r) => r.neighborhood)));

  const filteredReports = communityReports.filter((report) => {
    const resource = foodResources.find((r) => r.id === report.resourceId);
    if (!resource) return false;

    if (selectedNeighborhood !== 'all' && resource.neighborhood !== selectedNeighborhood) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        resource.name.toLowerCase().includes(query) ||
        report.comments.toLowerCase().includes(query) ||
        report.reporterLocation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Community Reports</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 w-64"
            />
          </div>
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
          >
            <option value="all">All Neighborhoods</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredReports.length} of {communityReports.length} reports
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const resource = foodResources.find((r) => r.id === report.resourceId);
            return (
              <ReportCard
                key={report.id}
                report={report}
                resourceName={resource?.name || 'Unknown Resource'}
              />
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No reports found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
