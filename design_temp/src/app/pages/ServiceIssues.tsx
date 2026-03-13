import { serviceDisruptions } from '../data/mockData';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

export function ServiceIssues() {
  const activeIssues = serviceDisruptions.filter((d) => d.status === 'active');
  const monitoringIssues = serviceDisruptions.filter((d) => d.status === 'monitoring');
  const resolvedIssues = serviceDisruptions.filter((d) => d.status === 'resolved');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-800 bg-red-100';
      case 'medium':
        return 'text-orange-800 bg-orange-100';
      case 'low':
        return 'text-yellow-800 bg-yellow-100';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-800 bg-red-50 border-red-200';
      case 'monitoring':
        return 'text-orange-800 bg-orange-50 border-orange-200';
      case 'resolved':
        return 'text-green-800 bg-green-50 border-green-200';
      default:
        return 'text-gray-800 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-gray-900">Service Issues</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Active Issues</p>
          </div>
          <p className="text-3xl text-gray-900">{activeIssues.length}</p>
          <p className="text-xs text-gray-500 mt-1">Require immediate attention</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600">Monitoring</p>
          </div>
          <p className="text-3xl text-gray-900">{monitoringIssues.length}</p>
          <p className="text-xs text-gray-500 mt-1">Under observation</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Resolved This Week</p>
          </div>
          <p className="text-3xl text-gray-900">{resolvedIssues.length}</p>
          <p className="text-xs text-gray-500 mt-1">Successfully addressed</p>
        </div>
      </div>

      {/* Active Issues */}
      {activeIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Active Issues</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activeIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-6 border-l-4 ${getStatusColor(issue.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900">{issue.resourceName}</h4>
                    <p className="text-sm text-gray-700 mt-1">{issue.issue}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Reported on {new Date(issue.reportedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs capitalize ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity} severity
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{issue.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Issues */}
      {monitoringIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Under Monitoring</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {monitoringIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-6 border-l-4 ${getStatusColor(issue.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900">{issue.resourceName}</h4>
                    <p className="text-sm text-gray-700 mt-1">{issue.issue}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Reported on {new Date(issue.reportedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs capitalize ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity} severity
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{issue.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved Issues */}
      {resolvedIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Recently Resolved</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {resolvedIssues.map((issue) => (
              <div
                key={issue.id}
                className={`p-6 border-l-4 ${getStatusColor(issue.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-gray-900">{issue.resourceName}</h4>
                    <p className="text-sm text-gray-700 mt-1">{issue.issue}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Reported on {new Date(issue.reportedDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs capitalize ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity} severity
                    </span>
                    <span className="text-xs text-green-700 capitalize flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {issue.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
