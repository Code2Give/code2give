import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { waitTimeTrends, demandByDistrict, foodAvailabilityTrends } from '../data/mockData';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';

export function TrendsAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-gray-900">Trends & Analytics</h1>

      {/* Insight Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#2E7D32]" />
            <p className="text-sm text-gray-600">Report Volume</p>
          </div>
          <p className="text-2xl text-gray-900">+24%</p>
          <p className="text-xs text-gray-500 mt-1">vs last week</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#FF8F00]" />
            <p className="text-sm text-gray-600">Avg Wait Time</p>
          </div>
          <p className="text-2xl text-gray-900">+8%</p>
          <p className="text-xs text-gray-500 mt-1">Increasing trend</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#42A5F5]" />
            <p className="text-sm text-gray-600">Peak Day</p>
          </div>
          <p className="text-2xl text-gray-900">Tuesday</p>
          <p className="text-xs text-gray-500 mt-1">Highest demand</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-[#2E7D32]" />
            <p className="text-sm text-gray-600">Food Availability</p>
          </div>
          <p className="text-2xl text-gray-900">-12%</p>
          <p className="text-xs text-gray-500 mt-1">Produce declining</p>
        </div>
      </div>

      {/* Wait Time Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Wait Time & Report Volume Trends</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={waitTimeTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgWait"
              stroke="#FF8F00"
              strokeWidth={3}
              name="Avg Wait Time (min)"
              dot={{ fill: '#FF8F00', r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reports"
              stroke="#42A5F5"
              strokeWidth={3}
              name="Total Reports"
              dot={{ fill: '#42A5F5', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Demand by District */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Demand by District</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={demandByDistrict}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="district" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="demand" fill="#2E7D32" name="Weekly Reports" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        {/* District Insights */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          {demandByDistrict.map((district) => (
            <div key={district.district} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{district.district}</p>
              <p className="text-xl text-gray-900 mt-1">{district.demand} reports</p>
              <p className="text-xs text-gray-500 mt-1">
                Pop: {(district.population / 1000).toFixed(0)}k
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Food Availability Trends */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Food Availability Trends (% Available)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={foodAvailabilityTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
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
              strokeWidth={2}
              name="Produce"
              dot={{ fill: '#2E7D32' }}
            />
            <Line
              type="monotone"
              dataKey="meat"
              stroke="#FF8F00"
              strokeWidth={2}
              name="Meat"
              dot={{ fill: '#FF8F00' }}
            />
            <Line
              type="monotone"
              dataKey="staples"
              stroke="#42A5F5"
              strokeWidth={2}
              name="Pantry Staples"
              dot={{ fill: '#42A5F5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
