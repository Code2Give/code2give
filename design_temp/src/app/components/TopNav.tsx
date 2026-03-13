import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

export type UserRole = 'internal' | 'government' | 'donor' | 'provider';

interface TopNavProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels: Record<UserRole, string> = {
  internal: 'Lemontree Team',
  government: 'Government Agency',
  donor: 'Donor / Foundation',
  provider: 'Food Provider',
};

export function TopNav({ userRole, onRoleChange }: TopNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-gray-900">Dashboard</h1>
        <div className="h-6 w-px bg-gray-300" />
        <span className="text-sm text-gray-600">March 13, 2026</span>
      </div>

      {/* User Role Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-900">{roleLabels[userRole]}</span>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    userRole === role ? 'text-[#2E7D32] bg-[#2E7D32]/5' : 'text-gray-700'
                  }`}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
