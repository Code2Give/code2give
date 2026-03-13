import { CommunityReport } from '../data/mockData';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReportCardProps {
  report: CommunityReport;
  resourceName: string;
}

export function ReportCard({ report, resourceName }: ReportCardProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={report.photoUrl}
          alt={`Report from ${resourceName}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-gray-900">{resourceName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-600">{report.reporterLocation}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">Wait: {report.waitTime} min</span>
        </div>

        {/* Food Availability */}
        <div className="flex gap-2 flex-wrap">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              report.foodAvailability.produce
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {report.foodAvailability.produce ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>Produce</span>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              report.foodAvailability.meat
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {report.foodAvailability.meat ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>Meat</span>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              report.foodAvailability.pantryStaples
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {report.foodAvailability.pantryStaples ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            <span>Staples</span>
          </div>
        </div>

        {/* Comments */}
        <p className="text-sm text-gray-700">{report.comments}</p>

        {/* Issues */}
        {report.issues && (
          <div className="flex items-start gap-2 p-2 bg-orange-50 rounded">
            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-orange-800">{report.issues}</p>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-gray-500">{formatDate(report.timestamp)}</p>
      </div>
    </div>
  );
}
