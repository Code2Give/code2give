import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav, UserRole } from './TopNav';

export function DashboardLayout() {
  const [userRole, setUserRole] = useState<UserRole>('internal');

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <TopNav userRole={userRole} onRoleChange={setUserRole} />
      
      <main className="ml-64 pt-16">
        <div className="p-8">
          <Outlet context={{ userRole }} />
        </div>
      </main>
    </div>
  );
}
