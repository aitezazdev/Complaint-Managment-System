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
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">Total Complaints</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">{stats.totalComplaints}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="text-3xl font-semibold text-amber-600 mt-2">{stats.pending}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">In Progress</p>
          <p className="text-3xl font-semibold text-blue-600 mt-2">{stats.inProgress}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">Resolved</p>
          <p className="text-3xl font-semibold text-green-600 mt-2">{stats.resolved}</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">Critical Priority</p>
          <p className="text-3xl font-semibold text-red-600 mt-2">{stats.critical}</p>
          <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">High Priority</p>
          <p className="text-3xl font-semibold text-orange-600 mt-2">{stats.high}</p>
          <p className="text-xs text-gray-500 mt-1">Needs prompt action</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {stats.totalComplaints > 0 
              ? Math.round((stats.resolved / stats.totalComplaints) * 100) 
              : 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Of all complaints</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
        <div className="space-y-3">
          {[
            { label: 'Pending', value: stats.pending, total: stats.totalComplaints, color: 'bg-amber-500' },
            { label: 'In Progress', value: stats.inProgress, total: stats.totalComplaints, color: 'bg-blue-500' },
            { label: 'Resolved', value: stats.resolved, total: stats.totalComplaints, color: 'bg-green-500' },
            { label: 'Rejected', value: stats.rejected, total: stats.totalComplaints, color: 'bg-red-500' }
          ].map((item) => {
            const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="text-gray-600">{item.value} ({Math.round(percentage)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
          <Link 
            to="/admin/complaints" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaints.slice(0, 5).length > 0 ? (
                complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{complaint.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {complaint.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-700">{complaint.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
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