import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Upload, X } from 'lucide-react';
import { JobApplication, ApplicationPayload, ApplicationPriority, ApplicationStatus, ResumeAttachment } from '../types';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: Partial<ApplicationPayload>) => void;
  application: JobApplication | null;
  isLoading: boolean;
  error?: string;
}

const statuses: ApplicationStatus[] = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected', 'Withdrawn'
];

const priorities: ApplicationPriority[] = ['Low', 'Medium', 'High'];
const MAX_RESUME_SIZE = 2 * 1024 * 1024;
const MAX_NOTES_LENGTH = 20000;
const MAX_JOB_DESCRIPTION_LENGTH = 30000;
const resumeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  application,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState<Partial<ApplicationPayload>>({
    company: '',
    role: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    jobUrl: '',
    salary: '',
    location: '',
    priority: 'Medium',
    source: '',
    contactName: '',
    contactEmail: '',
    followUpDate: '',
    jobDescription: '',
    resume: undefined,
    notes: '',
  });
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    if (application) {
      setFormData({
        company: application.company,
        role: application.role,
        status: application.status,
        dateApplied: new Date(application.dateApplied).toISOString().split('T')[0],
        jobUrl: application.jobUrl || '',
        salary: application.salary || '',
        location: application.location || '',
        priority: application.priority || 'Medium',
        source: application.source || '',
        contactName: application.contactName || '',
        contactEmail: application.contactEmail || '',
        followUpDate: application.followUpDate
          ? new Date(application.followUpDate).toISOString().split('T')[0]
          : '',
        jobDescription: application.jobDescription || '',
        resume: application.resume,
        notes: application.notes || '',
      });
    } else {
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
        jobUrl: '',
        salary: '',
        location: '',
        priority: 'Medium',
        source: '',
        contactName: '',
        contactEmail: '',
        followUpDate: '',
        jobDescription: '',
        resume: undefined,
        notes: '',
      });
    }
    setResumeError('');
  }, [application, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (!resumeTypes.includes(file.type)) {
      setResumeError('Upload a PDF, DOC, or DOCX resume.');
      return;
    }

    if (file.size > MAX_RESUME_SIZE) {
      setResumeError('Resume must be 2 MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resume: ResumeAttachment = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        data: reader.result as string,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({ ...prev, resume }));
      setResumeError('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({ ...prev, resume: null }));
    setResumeError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {application ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                <input
                  required
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="e.g. Google"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  required
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="e.g. Frontend Engineer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                <input
                  type="date"
                  name="dateApplied"
                  value={formData.dateApplied}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="e.g. Remote, NY"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="e.g. $120k - $150k"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
              <input
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="LinkedIn, referral, company site"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="Recruiter or referral"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="recruiter@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume Used</label>
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
                {formData.resume ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center min-w-0">
                      <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{formData.resume.fileName}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(formData.resume.fileSize)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center text-center">
                    <Upload className="h-7 w-7 text-gray-400" />
                    <span className="mt-2 text-sm font-medium text-gray-700">Upload resume</span>
                    <span className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX up to 2 MB</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
              {resumeError && <p className="mt-2 text-sm text-red-600">{resumeError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={MAX_NOTES_LENGTH}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none"
                placeholder="Follow-up thoughts, interview prep, salary notes..."
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {(formData.notes || '').length}/{MAX_NOTES_LENGTH}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription || ''}
                onChange={handleChange}
                maxLength={MAX_JOB_DESCRIPTION_LENGTH}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-y"
                placeholder="Paste the job post here so you can tailor your resume/interview prep later."
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {(formData.jobDescription || '').length}/{MAX_JOB_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            {error && (
              <div className="mr-auto rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
