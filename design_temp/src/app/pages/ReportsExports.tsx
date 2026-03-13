import { Download, FileText, Calendar } from 'lucide-react';
import { useState } from 'react';

export function ReportsExports() {
  const [dateRange, setDateRange] = useState('last-week');
  const [reportType, setReportType] = useState('all');

  const handleExport = (format: 'pdf' | 'csv') => {
    alert(`Exporting ${reportType} reports as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-gray-900">Reports & Exports</h1>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="mb-4 text-gray-900">Export Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
            >
              <option value="today">Today</option>
              <option value="last-week">Last Week</option>
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-900"
            >
              <option value="all">All Reports</option>
              <option value="community">Community Reports Only</option>
              <option value="resources">Resource Data Only</option>
              <option value="analytics">Analytics Summary</option>
              <option value="issues">Service Issues</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-[#2E7D32]/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export as CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Saved Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">Recent Exports</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-900">Weekly Community Reports - March 2026</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Exported on Mar 10, 2026</span>
                </div>
              </div>
            </div>
            <button className="text-sm text-[#2E7D32] hover:underline">Download</button>
          </div>
          <div className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-900">Analytics Summary - February 2026</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Exported on Mar 3, 2026</span>
                </div>
              </div>
            </div>
            <button className="text-sm text-[#2E7D32] hover:underline">Download</button>
          </div>
          <div className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-900">Service Issues Report - Q1 2026</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Exported on Feb 28, 2026</span>
                </div>
              </div>
            </div>
            <button className="text-sm text-[#2E7D32] hover:underline">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
