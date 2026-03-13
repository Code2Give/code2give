import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  TrendingUp,
  Apple,
  AlertTriangle,
  Database,
  FileDown,
  Settings,
  Leaf,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/map', label: 'Food Resource Map', icon: MapPin },
  { path: '/reports', label: 'Community Reports', icon: FileText },
  { path: '/trends', label: 'Trends & Analytics', icon: TrendingUp },
  { path: '/availability', label: 'Food Availability', icon: Apple },
  { path: '/issues', label: 'Service Issues', icon: AlertTriangle },
  { path: '/explorer', label: 'Data Explorer', icon: Database },
  { path: '/exports', label: 'Reports & Exports', icon: FileDown },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl text-gray-900">Lemontree</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
