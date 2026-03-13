import { UserRole } from '../components/TopNav';
import { useOutletContext } from 'react-router';
import { KPICard } from '../components/KPICard';
import { InteractiveMap } from '../components/InteractiveMap';
import { ReportCard } from '../components/ReportCard';
import {
  foodResources,
  communityReports,
  impactMetrics,
  waitTimeTrends,
} from '../data/mockData';
import {
  FileText,
  MapPin,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OverviewProps {
  userRole: UserRole;
}

interface OutletContext {
  userRole: UserRole;
}

export function Overview() {
  const { userRole } = useOutletContext<OutletContext>();
  const recentReports = communityReports.slice(0, 3);

  // Render different KPIs based on user role
  const renderKPIs = () => {
    switch (userRole) {
      case 'internal':
        return (
          <>
            <KPICard
              title="Total Reports"
              value={impactMetrics.totalReports.toLocaleString()}
              icon={FileText}
              trend={{ value: impactMetrics.reportGrowth, isPositive: true }}
            />
            <KPICard
              title="Active Resources"
              value={impactMetrics.activeResources}
              icon={MapPin}
            />
            <KPICard
              title="Avg Wait Time"
              value={`${impactMetrics.avgWaitTime} min`}
              icon={Clock}
              trend={{ value: 8, isPositive: false }}
            />
            <KPICard
              title="Resources With Issues"
              value={impactMetrics.resourcesWithIssues}
              icon={AlertTriangle}
            />
          </>
        );
      case 'government':
        return (
          <>
            <KPICard
              title="Communities Served"
              value={impactMetrics.communitiesServed}
              icon={MapPin}
            />
            <KPICard
              title="Demand Growth"
              value={`${impactMetrics.demandGrowth}%`}
              icon={TrendingUp}
              trend={{ value: impactMetrics.demandGrowth, isPositive: true }}
            />
            <KPICard
              title="Active Resources"
              value={impactMetrics.activeResources}
              icon={BarChart3}
            />
            <KPICard
              title="Service Gaps"
              value={impactMetrics.resourcesWithIssues}
              icon={AlertTriangle}
            />
          </>
        );
      case 'donor':
        return (
          <>
            <KPICard
              title="Communities Served"
              value={impactMetrics.communitiesServed}
              icon={Users}
            />
            <KPICard
              title="Demand Growth"
              value={`${impactMetrics.demandGrowth}%`}
              icon={TrendingUp}
              trend={{ value: impactMetrics.demandGrowth, isPositive: true }}
            />
            <KPICard
              title="Satisfaction Rate"
              value={`${impactMetrics.satisfactionRate}%`}
              icon={BarChart3}
            />
            <KPICard
              title="Funding Opportunities"
              value={impactMetrics.resourcesWithIssues}
              icon={DollarSign}
            />
          </>
        );
      case 'provider':
        return (
          <>
            <KPICard
              title="Reports This Week"
              value={waitTimeTrends[waitTimeTrends.length - 1].reports}
              icon={FileText}
              trend={{ value: 12, isPositive: true }}
            />
            <KPICard
              title="Avg Wait Time"
              value={`${impactMetrics.avgWaitTime} min`}
              icon={Clock}
              trend={{ value: 8, isPositive: false }}
            />
            <KPICard
              title="Satisfaction Rate"
              value={`${impactMetrics.satisfactionRate}%`}
              icon={BarChart3}
            />
            <KPICard
              title="Active Alerts"
              value={impactMetrics.resourcesWithIssues}
              icon={AlertTriangle}
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">{renderKPIs()}</div>

      {/* Map and Reports Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="mb-4 text-gray-900">Food Resource Map</h2>
          <div className="h-[400px]">
            <InteractiveMap resources={foodResources} />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="mb-4 text-gray-900">Recent Reports</h3>
            <div className="space-y-4">
              {recentReports.map((report) => {
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
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Wait Time & Report Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={waitTimeTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="avgWait"
              stroke="#2E7D32"
              strokeWidth={2}
              name="Avg Wait (min)"
              dot={{ fill: '#2E7D32' }}
            />
            <Line
              type="monotone"
              dataKey="reports"
              stroke="#42A5F5"
              strokeWidth={2}
              name="Reports"
              dot={{ fill: '#42A5F5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}