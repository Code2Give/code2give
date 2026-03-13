import { useState } from 'react';
import { communityReports, foodResources } from '../data/mockData';
import { Search, Filter, Download, SortAsc, SortDesc } from 'lucide-react';

type SortField = 'date' | 'resource' | 'waitTime' | 'neighborhood';
type SortDirection = 'asc' | 'desc';

export function DataExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const neighborhoods = Array.from(new Set(foodResources.map((r) => r.neighborhood)));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const tableData = communityReports
    .map((report) => {
      const resource = foodResources.find((r) => r.id === report.resourceId);
      return {
        ...report,
        resourceName: resource?.name || 'Unknown',
        resourceType: resource?.type || 'unknown',
        neighborhood: resource?.neighborhood || 'Unknown',
      };
    })
    .filter((item) => {
      if (selectedNeighborhood !== 'all' && item.neighborhood !== selectedNeighborhood) {
        return false;
      }
      if (selectedResourceType !== 'all' && item.resourceType !== selectedResourceType) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.resourceName.toLowerCase().includes(query) ||
          item.comments.toLowerCase().includes(query) ||
          item.neighborhood.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'resource':
          comparison = a.resourceName.localeCompare(b.resourceName);
          break;
        case 'waitTime':
          comparison = a.waitTime - b.waitTime;
          break;
        case 'neighborhood':
          comparison = a.neighborhood.localeCompare(b.neighborhood);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const exportCSV = () => {
    const headers = [
      'Resource Name',
      'Neighborhood',
      'Report Date',
      'Wait Time (min)',
      'Produce',
      'Meat',
      'Staples',
      'Comments',
      'Issues',
    ];

    const rows = tableData.map((item) => [
      item.resourceName,
      item.neighborhood,
      new Date(item.timestamp).toLocaleString(),
      item.waitTime,
      item.foodAvailability.produce ? 'Yes' : 'No',
      item.foodAvailability.meat ? 'Yes' : 'No',
      item.foodAvailability.pantryStaples ? 'Yes' : 'No',
      item.comments,
      item.issues || 'None',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lemontree-reports.csv';
    a.click();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <SortAsc className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <SortAsc className="w-4 h-4 text-[#2E7D32]" />
    ) : (
      <SortDesc className="w-4 h-4 text-[#2E7D32]" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Data Explorer</h1>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#2E7D32]/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by resource, comments, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
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
          <select
            value={selectedResourceType}
            onChange={(e) => setSelectedResourceType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
          >
            <option value="all">All Types</option>
            <option value="pantry">Food Pantries</option>
            <option value="fridge">Community Fridges</option>
            <option value="meal-program">Meal Programs</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {tableData.length} of {communityReports.length} reports
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('resource')}
                    className="flex items-center gap-2 hover:text-[#2E7D32] transition-colors"
                  >
                    <span className="text-sm text-gray-700">Resource Name</span>
                    <SortIcon field="resource" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('neighborhood')}
                    className="flex items-center gap-2 hover:text-[#2E7D32] transition-colors"
                  >
                    <span className="text-sm text-gray-700">Neighborhood</span>
                    <SortIcon field="neighborhood" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 hover:text-[#2E7D32] transition-colors"
                  >
                    <span className="text-sm text-gray-700">Report Date</span>
                    <SortIcon field="date" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <button
                    onClick={() => handleSort('waitTime')}
                    className="flex items-center gap-2 hover:text-[#2E7D32] transition-colors"
                  >
                    <span className="text-sm text-gray-700">Wait Time</span>
                    <SortIcon field="waitTime" />
                  </button>
                </th>
                <th className="text-left p-4">
                  <span className="text-sm text-gray-700">Food Available</span>
                </th>
                <th className="text-left p-4">
                  <span className="text-sm text-gray-700">Comments</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm text-gray-900">{item.resourceName}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.resourceType.replace('-', ' ')}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{item.neighborhood}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">
                      {new Date(item.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{item.waitTime} min</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {item.foodAvailability.produce && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Produce
                        </span>
                      )}
                      {item.foodAvailability.meat && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Meat
                        </span>
                      )}
                      {item.foodAvailability.pantryStaples && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Staples
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 max-w-md">
                    <p className="text-sm text-gray-700 truncate">{item.comments}</p>
                    {item.issues && (
                      <p className="text-xs text-orange-600 mt-1">{item.issues}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
