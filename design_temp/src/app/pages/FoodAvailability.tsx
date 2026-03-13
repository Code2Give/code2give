import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { foodAvailabilityTrends, communityReports } from '../data/mockData';
import { Apple, Package, Beef } from 'lucide-react';

export function FoodAvailability() {
  // Calculate current availability
  const recentReports = communityReports.slice(0, 10);
  const produceAvailable = recentReports.filter((r) => r.foodAvailability.produce).length;
  const meatAvailable = recentReports.filter((r) => r.foodAvailability.meat).length;
  const staplesAvailable = recentReports.filter((r) => r.foodAvailability.pantryStaples).length;

  const producePercent = Math.round((produceAvailable / recentReports.length) * 100);
  const meatPercent = Math.round((meatAvailable / recentReports.length) * 100);
  const staplesPercent = Math.round((staplesAvailable / recentReports.length) * 100);

  const categoryData = [
    { category: 'Produce', availability: producePercent },
    { category: 'Meat', availability: meatPercent },
    { category: 'Staples', availability: staplesPercent },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-gray-900">Food Availability</h1>

      {/* Current Availability Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Apple className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Produce</p>
              <p className="text-2xl text-gray-900">{producePercent}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${producePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Available at {produceAvailable} of {recentReports.length} resources
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Beef className="w-6 h-6 text-orange-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Meat & Protein</p>
              <p className="text-2xl text-gray-900">{meatPercent}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all"
              style={{ width: `${meatPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Available at {meatAvailable} of {recentReports.length} resources
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pantry Staples</p>
              <p className="text-2xl text-gray-900">{staplesPercent}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${staplesPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Available at {staplesAvailable} of {recentReports.length} resources
          </p>
        </div>
      </div>

      {/* Availability by Category */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Current Availability by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
            <YAxis dataKey="category" type="category" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="availability" fill="#2E7D32" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trends Over Time */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Availability Trends (4 Weeks)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={foodAvailabilityTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" />
            <YAxis domain={[0, 100]} stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="produce"
              stroke="#2E7D32"
              strokeWidth={3}
              name="Produce (%)"
              dot={{ fill: '#2E7D32', r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="meat"
              stroke="#FF8F00"
              strokeWidth={3}
              name="Meat (%)"
              dot={{ fill: '#FF8F00', r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="staples"
              stroke="#42A5F5"
              strokeWidth={3}
              name="Staples (%)"
              dot={{ fill: '#42A5F5', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4 text-gray-900">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#2E7D32] rounded-full mt-2" />
              <div>
                <p className="text-sm text-gray-900">Produce availability declining</p>
                <p className="text-xs text-gray-600 mt-1">
                  Down 10% from last week. Consider increasing produce donations.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF8F00] rounded-full mt-2" />
              <div>
                <p className="text-sm text-gray-900">Meat supply stable</p>
                <p className="text-xs text-gray-600 mt-1">
                  Maintaining 68% availability across all resources.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#42A5F5] rounded-full mt-2" />
              <div>
                <p className="text-sm text-gray-900">Pantry staples well stocked</p>
                <p className="text-xs text-gray-600 mt-1">
                  Consistent availability above 88% across all locations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="mb-4 text-gray-900">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">Priority: Fresh Produce</p>
              <p className="text-xs text-green-700 mt-1">
                Focus on securing more fresh fruits and vegetables. Partner with local farms.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">Maintain: Staples Supply</p>
              <p className="text-xs text-blue-700 mt-1">
                Current staples inventory is strong. Continue current donation strategies.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-900">Monitor: Protein Sources</p>
              <p className="text-xs text-orange-700 mt-1">
                Keep an eye on meat and protein availability. Explore alternative protein options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
