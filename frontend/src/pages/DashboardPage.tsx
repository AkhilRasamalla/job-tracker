import { useMemo } from 'react';
import { useApplications } from '../hooks';
import { StatusCard, StatusBarChart, LoadingSpinner, ErrorMessage } from '../components';
import { 
  Briefcase, 
  Send, 
  Search, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  MinusCircle,
  FileText 
} from 'lucide-react';

const DashboardPage = () => {
  const { data: applications, isLoading, isError } = useApplications();

  const stats = useMemo(() => {
    if (!applications) return null;

    const counts = {
      Wishlist: 0,
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0,
      Total: applications.length,
      Resumes: 0
    };

    applications.forEach(app => {
      counts[app.status]++;
      if (app.resume) {
        counts.Resumes++;
      }
    });

    const chartData = [
      { name: 'Wishlist', count: counts.Wishlist, fill: '#9ca3af' }, // gray-400
      { name: 'Applied', count: counts.Applied, fill: '#60a5fa' }, // blue-400
      { name: 'Screening', count: counts.Screening, fill: '#c084fc' }, // purple-400
      { name: 'Interview', count: counts.Interview, fill: '#facc15' }, // yellow-400
      { name: 'Offer', count: counts.Offer, fill: '#4ade80' }, // green-400
      { name: 'Rejected', count: counts.Rejected, fill: '#f87171' }, // red-400
    ];

    return { counts, chartData };
  }, [applications]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage 
          title="Dashboard Error" 
          message="Failed to load dashboard data. Please try again later." 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your job search progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Total Applications"
          count={stats.counts.Total}
          icon={Briefcase}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatusCard
          title="Interviews"
          count={stats.counts.Interview}
          icon={MessageSquare}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-50"
        />
        <StatusCard
          title="Offers"
          count={stats.counts.Offer}
          icon={CheckCircle}
          colorClass="text-green-600"
          bgClass="bg-green-50"
        />
        <StatusCard
          title="Resumes Saved"
          count={stats.counts.Resumes}
          icon={FileText}
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <StatusBarChart data={stats.chartData} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="flex items-center text-gray-600">
                <Search className="w-4 h-4 mr-2 text-purple-500" />
                <span>Screening</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.counts.Screening}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="flex items-center text-gray-600">
                <Send className="w-4 h-4 mr-2 text-blue-500" />
                <span>Applied</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.counts.Applied}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                <span>Wishlist</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.counts.Wishlist}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="flex items-center text-gray-600">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                <span>Rejected</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.counts.Rejected}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="flex items-center text-gray-600">
                <MinusCircle className="w-4 h-4 mr-2 text-gray-400" />
                <span>Withdrawn</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.counts.Withdrawn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
