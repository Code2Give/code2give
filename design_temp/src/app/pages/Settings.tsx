import { User, Bell, Lock, Database, HelpCircle } from 'lucide-react';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-gray-900">Settings</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-gray-900">Account</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="Lemontree"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue="admin@lemontree.org"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
              />
            </div>
            <button className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#2E7D32]/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#42A5F5]/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#42A5F5]" />
            </div>
            <h3 className="text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email alerts for new reports</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Service issue alerts</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Weekly summary reports</span>
              <input type="checkbox" className="rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data export completion</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#FF8F00]/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#FF8F00]" />
            </div>
            <h3 className="text-gray-900">Security</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-900">Change Password</p>
              <p className="text-xs text-gray-500 mt-1">Update your account password</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 mt-1">Add an extra layer of security</p>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="text-gray-900">Data Management</h3>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-900">Data Retention</p>
              <p className="text-xs text-gray-500 mt-1">Configure data storage policies</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-900">Export All Data</p>
              <p className="text-xs text-gray-500 mt-1">Download complete database backup</p>
            </button>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-[#42A5F5]/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#42A5F5]" />
          </div>
          <h3 className="text-gray-900">Help & Support</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-900">Documentation</p>
            <p className="text-xs text-gray-500 mt-1">View user guides</p>
          </button>
          <button className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-900">Contact Support</p>
            <p className="text-xs text-gray-500 mt-1">Get help from our team</p>
          </button>
          <button className="text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <p className="text-sm text-gray-900">API Access</p>
            <p className="text-xs text-gray-500 mt-1">Integrate with other tools</p>
          </button>
        </div>
      </div>
    </div>
  );
}
