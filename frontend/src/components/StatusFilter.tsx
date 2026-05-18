import React from 'react';
import { useFilterStore } from '../store';
import { ApplicationStatus } from '../types';

const statuses: (ApplicationStatus | 'All')[] = [
  'All',
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

const StatusFilter: React.FC = () => {
  const { statusFilter, setStatusFilter } = useFilterStore();

  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2 mb-6">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => setStatusFilter(status)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            statusFilter === status
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
