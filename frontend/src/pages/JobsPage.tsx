import { useState, useMemo } from 'react';
import { ArrowUpDown, Plus, Search } from 'lucide-react';
import axios from 'axios';
import { 
  useApplications, 
  useCreateApplication, 
  useUpdateApplication, 
  useDeleteApplication 
} from '../hooks';
import { ApplicationStatus, JobApplication, ApplicationPayload } from '../types';
import { JobCard, JobFormModal, DeleteConfirmModal, StatusFilter, LoadingSpinner, ErrorMessage } from '../components';
import { useFilterStore } from '../store';

const JobsPage = () => {
  const { data: applications, isLoading, isError, error } = useApplications();
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();
  const statusFilter = useFilterStore((state) => state.statusFilter);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const getErrorMessage = (err: unknown) => {
    if (axios.isAxiosError<{ message?: string }>(err)) {
      return err.response?.data?.message || err.message || 'Request failed';
    }
    return err instanceof Error ? err.message : 'Something went wrong';
  };

  const handleOpenAdd = () => {
    setSelectedApplication(null);
    setFormError('');
    setSaveMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setFormError('');
    setSaveMessage('');
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (id: string) => {
    setApplicationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormModalOpen(false);
    setSelectedApplication(null);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setApplicationToDelete(null);
  };

  const handleFormSubmit = async (payload: Partial<ApplicationPayload>) => {
    setFormError('');
    setSaveMessage('');

    try {
      if (selectedApplication) {
        await updateMutation.mutateAsync({ id: selectedApplication._id, payload });
        setSaveMessage('Application updated successfully.');
      } else {
        await createMutation.mutateAsync(payload as ApplicationPayload);
        setSaveMessage('Application saved successfully.');
      }
      handleCloseForm();
    } catch (err) {
      setFormError(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = async () => {
    if (applicationToDelete) {
      try {
        await deleteMutation.mutateAsync(applicationToDelete);
        setSaveMessage('Application deleted successfully.');
        handleCloseDelete();
      } catch (err) {
        setSaveMessage(`Delete failed: ${getErrorMessage(err)}`);
      }
    }
  };

  const handleStatusChange = async (application: JobApplication, status: ApplicationStatus) => {
    if (application.status === status) return;

    try {
      await updateMutation.mutateAsync({ id: application._id, payload: { status } });
      setSaveMessage(`Moved ${application.company} to ${status}.`);
    } catch (err) {
      setSaveMessage(`Status update failed: ${getErrorMessage(err)}`);
    }
  };

  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    const query = searchQuery.trim().toLowerCase();
    const priorityScore = { High: 3, Medium: 2, Low: 1 };

    return applications
      .filter((app) => {
        if (statusFilter !== 'All' && app.status !== statusFilter) return false;
        if (!query) return true;

        return [
          app.company,
          app.role,
          app.location,
          app.salary,
          app.source,
          app.contactName,
          app.contactEmail,
          app.notes,
          app.jobDescription,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      })
      .sort((a, b) => {
        if (sortBy === 'followUp') {
          const aTime = a.followUpDate ? new Date(a.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
          const bTime = b.followUpDate ? new Date(b.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        }

        if (sortBy === 'priority') {
          return (priorityScore[b.priority || 'Medium'] || 0) - (priorityScore[a.priority || 'Medium'] || 0);
        }

        if (sortBy === 'dateApplied') {
          return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
        }

        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [applications, searchQuery, sortBy, statusFilter]);

  const visibleCount = filteredApplications.length;
  const totalCount = applications?.length || 0;

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your job search process
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </button>
      </div>

      <StatusFilter />

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search company, role, notes, contacts, or job description"
          />
        </label>
        <label className="relative block min-w-48">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="updated">Recently updated</option>
            <option value="followUp">Follow-up date</option>
            <option value="priority">Priority</option>
            <option value="dateApplied">Date applied</option>
          </select>
        </label>
        <div className="flex items-center rounded-lg bg-gray-50 px-3 text-sm font-medium text-gray-600">
          {visibleCount} of {totalCount}
        </div>
      </div>

      {saveMessage && (
        <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
          {saveMessage}
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : isError ? (
        <ErrorMessage 
          title="Failed to load applications" 
          message={error?.message || 'An unexpected error occurred'} 
        />
      ) : filteredApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app) => (
            <JobCard
              key={app._id}
              application={app}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            {statusFilter === 'All' ? 'No applications' : `No ${statusFilter} applications`}
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
            {statusFilter === 'All' 
              ? 'Get started by adding your first job application to track its progress.'
              : `You don't have any applications with the ${statusFilter} status.`}
          </p>
          {statusFilter === 'All' && (
            <div className="mt-6">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Application
              </button>
            </div>
          )}
        </div>
      )}

      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        application={selectedApplication}
        isLoading={isMutating}
        error={formError}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default JobsPage;
