import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllComplaints } from '../store/slice/complaint';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, AlertCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { complaints, loading } = useSelector((state) => state.complaint);

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const stats = useMemo(() => {
    const pending = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;
    const rejected = complaints.filter(c => c.status === 'Rejected').length;
    const critical = complaints.filter(c => c.priority === 'Critical').length;
    const high = complaints.filter(c => c.priority === 'High').length;

    return {
      totalComplaints: complaints.length,
      pending,
      inProgress,
      resolved,
      rejected,
      critical,
      high,
      activeComplaints: pending + inProgress
    };
  }, [complaints]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-100';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Welcome back, {user?.name}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Total Complaints
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
              {stats.totalComplaints}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Pending
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              In Progress
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
              {stats.inProgress}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Resolved
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
              {stats.resolved}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Critical Priority
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {stats.critical}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Immediate attention required
                </p>
              </div>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  High Priority
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {stats.high}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Prompt action needed
                </p>
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Resolution Rate
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {stats.totalComplaints > 0 
                    ? Math.round((stats.resolved / stats.totalComplaints) * 100) 
                    : 0}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Overall completion rate
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-5 sm:mb-6">
            Status Distribution
          </h2>
          <div className="space-y-5">
            {[
              { label: 'Pending', value: stats.pending, total: stats.totalComplaints, color: 'bg-gray-400' },
              { label: 'In Progress', value: stats.inProgress, total: stats.totalComplaints, color: 'bg-blue-500' },
              { label: 'Resolved', value: stats.resolved, total: stats.totalComplaints, color: 'bg-green-500' },
              { label: 'Rejected', value: stats.rejected, total: stats.totalComplaints, color: 'bg-red-500' }
            ].map((item) => {
              const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">
                      {item.label}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {item.value} <span className="text-gray-500 font-normal">({Math.round(percentage)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Recent Complaints
            </h2>
            <Link 
              to="/admin/complaints" 
              className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Complaint
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Priority
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {complaints.slice(0, 5).length > 0 ? (
                  complaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900 text-sm">
                          {complaint.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-md mt-0.5">
                          {complaint.description}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y divide-gray-100">
            {complaints.slice(0, 5).length > 0 ? (
              complaints.slice(0, 5).map((complaint) => (
                <div key={complaint._id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base flex-1">
                      {complaint.title}
                    </h3>
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {complaint.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="text-gray-600">
                      {complaint.category}
                    </span>
                    
                    <span className="text-gray-300">•</span>
                    
                    <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-md border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                    
                    <span className="text-gray-300">•</span>
                    
                    <span className="text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-500 text-sm">
                No complaints found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;