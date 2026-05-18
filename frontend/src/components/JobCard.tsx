import React from 'react';
import { Briefcase, Building2, Calendar, MapPin, DollarSign, MoreVertical, Edit, Trash2, FileText, Download } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types';

interface JobCardProps {
  application: JobApplication;
  onEdit: (application: JobApplication) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<ApplicationStatus, string> = {
  Wishlist: 'bg-gray-100 text-gray-800 border-gray-200',
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  Screening: 'bg-purple-100 text-purple-800 border-purple-200',
  Interview: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Offer: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Withdrawn: 'bg-gray-200 text-gray-600 border-gray-300',
};

const JobCard: React.FC<JobCardProps> = ({ application, onEdit, onDelete }) => {
  const formattedDate = new Date(application.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedResumeSize = application.resume
    ? application.resume.fileSize < 1024 * 1024
      ? `${Math.round(application.resume.fileSize / 1024)} KB`
      : `${(application.resume.fileSize / (1024 * 1024)).toFixed(1)} MB`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200 group relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {application.role}
          </h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Building2 className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="font-medium text-sm truncate">{application.company}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[application.status]}`}>
            {application.status}
          </span>
          <div className="relative group/menu">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
              <button
                onClick={() => onEdit(application)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit
              </button>
              <button
                onClick={() => onDelete(application._id)}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{formattedDate}</span>
        </div>
        {application.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}
        {application.salary && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{application.salary}</span>
          </div>
        )}
        {application.jobUrl && (
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <a 
              href={application.jobUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              Job Link
            </a>
          </div>
        )}
      </div>

      {application.notes && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{application.notes}</p>
        </div>
      )}

      {application.resume && (
        <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center">
              <FileText className="mr-2 h-4 w-4 shrink-0 text-indigo-600" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{application.resume.fileName}</p>
                <p className="text-xs text-gray-500">{formattedResumeSize}</p>
              </div>
            </div>
            <a
              href={application.resume.data}
              download={application.resume.fileName}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm hover:bg-indigo-100"
              aria-label="Download resume"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
