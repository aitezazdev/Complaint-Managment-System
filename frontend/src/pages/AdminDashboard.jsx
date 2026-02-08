import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllComplaints } from '../store/slice/complaint';
import { Link } from 'react-router-dom';

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
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low': return 'bg-slate-50 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Total Complaints
          </p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">
            {stats.totalComplaints}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Pending Review
          </p>
          <p className="text-3xl font-semibold text-amber-600 mt-2">
            {stats.pending}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            In Progress
          </p>
          <p className="text-3xl font-semibold text-blue-600 mt-2">
            {stats.inProgress}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Resolved
          </p>
          <p className="text-3xl font-semibold text-emerald-600 mt-2">
            {stats.resolved}
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Critical Priority
          </p>
          <p className="text-3xl font-semibold text-rose-600 mt-2">
            {stats.critical}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Requires immediate attention
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            High Priority
          </p>
          <p className="text-3xl font-semibold text-orange-600 mt-2">
            {stats.high}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Needs prompt action
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            Resolution Rate
          </p>
          <p className="text-3xl font-semibold text-slate-900 mt-2">
            {stats.totalComplaints > 0 
              ? Math.round((stats.resolved / stats.totalComplaints) * 100) 
              : 0}%
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Of all complaints
          </p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-900 mb-5">
          Status Distribution
        </h2>
        <div className="space-y-4">
          {[
            { label: 'Pending', value: stats.pending, total: stats.totalComplaints, color: 'bg-amber-500' },
            { label: 'In Progress', value: stats.inProgress, total: stats.totalComplaints, color: 'bg-blue-500' },
            { label: 'Resolved', value: stats.resolved, total: stats.totalComplaints, color: 'bg-emerald-500' },
            { label: 'Rejected', value: stats.rejected, total: stats.totalComplaints, color: 'bg-rose-500' }
          ].map((item) => {
            const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-700 font-medium">{item.label}</span>
                  <span className="text-slate-600">
                    {item.value} <span className="text-slate-400">({Math.round(percentage)}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Complaints
          </h2>
          <Link 
            to="/admin/complaints" 
            className="text-sm text-slate-900 hover:text-slate-700 font-medium transition-colors"
          >
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.slice(0, 5).length > 0 ? (
                complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-900 text-sm">
                        {complaint.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate max-w-md mt-0.5">
                        {complaint.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-700">
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
                    <td className="py-4 px-6 text-sm text-slate-600">
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
                  <td colSpan="5" className="py-12 text-center text-slate-500 text-sm">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;