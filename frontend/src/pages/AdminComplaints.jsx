import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllComplaints, updateComplaintAsync, deleteComplaintAsync } from '../store/slice/complaint';

const AdminComplaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading, total, page, totalPages } = useSelector((state) => state.complaint);
  
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    page: 1,
    limit: 10
  });

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    adminNotes: ''
  });

  useEffect(() => {
    dispatch(fetchAllComplaints(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const openUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setUpdateData({
      status: complaint.status,
      priority: complaint.priority,
      adminNotes: complaint.adminNotes || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setUpdateData({ status: '', priority: '', adminNotes: '' });
  };

  const handleUpdate = async () => {
    if (!selectedComplaint) return;

    try {
      await dispatch(updateComplaintAsync({
        id: selectedComplaint._id,
        data: updateData
      })).unwrap();
      closeModal();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await dispatch(deleteComplaintAsync(id)).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

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
          All Complaints
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage and track all user complaints
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Roads">Roads</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Noise Pollution">Noise Pollution</option>
              <option value="Garbage Collection">Garbage Collection</option>
              <option value="Street Lighting">Street Lighting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 uppercase tracking-wider">
              Per Page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Complaint Details
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  User
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
                  Date
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-slate-900 text-sm">
                        {complaint.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate max-w-md mt-0.5">
                        {complaint.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {complaint.address}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-slate-900">
                        {complaint.userId?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {complaint.userId?.email || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-700">{complaint.category}</span>
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
                    <td className="py-4 px-6">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openUpdateModal(complaint)}
                          className="text-sm font-medium text-slate-900 hover:text-slate-700"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(complaint._id)}
                          className="text-sm font-medium text-rose-600 hover:text-rose-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 text-sm">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {complaints.length} of {total} complaints
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Update Complaint</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Complaint Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">{selectedComplaint?.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{selectedComplaint?.description}</p>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span>Category: {selectedComplaint?.category}</span>
                  <span>•</span>
                  <span>Address: {selectedComplaint?.address}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="border-b border-slate-200 pb-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Submitted by:</span> {selectedComplaint?.userId?.name} ({selectedComplaint?.userId?.email})
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Date:</span> {new Date(selectedComplaint?.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Images */}
              {selectedComplaint?.images && selectedComplaint.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attached Images
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedComplaint.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Complaint ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={updateData.adminNotes}
                  onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
                  rows="4"
                  placeholder="Add internal notes about this complaint..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Existing Admin Notes */}
              {selectedComplaint?.adminNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">Previous Notes:</p>
                  <p className="text-sm text-amber-700">{selectedComplaint.adminNotes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Updating...' : 'Update Complaint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;