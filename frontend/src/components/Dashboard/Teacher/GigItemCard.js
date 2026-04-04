import React from 'react';
import { useNavigate } from 'react-router-dom';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInWeeks === 1) return '1 week ago';
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  if (diffInYears === 1) return '1 year ago';
  return `${diffInYears} years ago`;
};

const GigItemCard = ({ gig }) => {
  const { id, title, education, experience, created_at, subject, subject_active } = gig;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/tutor/gig/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5">
        <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {title || 'No Title'}
        </h4>

        <div className="text-xs text-gray-700 space-y-2 mb-4">
          <div>
            <span className="font-medium">Education:</span> {education || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Experience:</span> {experience || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Subject:</span>
            <span>{subject}</span>
            {subject_active ? (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 border border-green-300">
                Active
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-700 border border-red-300">
                Pending
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Posted {formatRelativeTime(created_at)}
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleViewDetails}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default GigItemCard;
