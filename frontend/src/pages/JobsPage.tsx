import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { 
  useApplications, 
  useCreateApplication, 
  useUpdateApplication, 
  useDeleteApplication 
} from '../hooks';
import { JobApplication, ApplicationPayload } from '../types';
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

  const handleOpenAdd = () => {
    setSelectedApplication(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (application: JobApplication) => {
    setSelectedApplication(application);
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
    if (selectedApplication) {
      await updateMutation.mutateAsync({ id: selectedApplication._id, payload });
    } else {
      await createMutation.mutateAsync(payload as ApplicationPayload);
    }
    handleCloseForm();
  };

  const handleDeleteConfirm = async () => {
    if (applicationToDelete) {
      await deleteMutation.mutateAsync(applicationToDelete);
      handleCloseDelete();
    }
  };

  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    if (statusFilter === 'All') return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

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
