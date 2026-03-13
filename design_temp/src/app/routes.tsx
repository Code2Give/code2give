import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './pages/Overview';
import { FoodResourceMap } from './pages/FoodResourceMap';
import { CommunityReports } from './pages/CommunityReports';
import { TrendsAnalytics } from './pages/TrendsAnalytics';
import { FoodAvailability } from './pages/FoodAvailability';
import { ServiceIssues } from './pages/ServiceIssues';
import { DataExplorer } from './pages/DataExplorer';
import { ReportsExports } from './pages/ReportsExports';
import { Settings } from './pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Overview },
      { path: 'map', Component: FoodResourceMap },
      { path: 'reports', Component: CommunityReports },
      { path: 'trends', Component: TrendsAnalytics },
      { path: 'availability', Component: FoodAvailability },
      { path: 'issues', Component: ServiceIssues },
      { path: 'explorer', Component: DataExplorer },
      { path: 'exports', Component: ReportsExports },
      { path: 'settings', Component: Settings },
    ],
  },
]);
