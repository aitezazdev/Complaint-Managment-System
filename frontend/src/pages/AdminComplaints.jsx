import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllComplaints, updateComplaintAsync, deleteComplaintAsync } from '../store/slice/complaint';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import ComplaintModal from '../components/ComplaintModal';
import { 
  Search, 
  X, 
  Filter, 
  MapPin, 
  Calendar, 
  Image as ImageIcon,
  Eye,
  Pencil,
  Trash2,
  FileText,
  User
} from "lucide-react";

const AdminComplaints = () => {
  const dispatch = useDispatch();
  const { complaints, loading, total, page, totalPages } = useSelector((state) => state.complaint);
  
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viewModalState, setViewModalState] = useState({
    isOpen: false,
    complaint: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    complaintId: null,
    complaintTitle: '',
  });
  const [deletingId, setDeletingId] = useState(null);

  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    adminNotes: ''
  });

  useEffect(() => {
    const fetchParams = {
      status: filters.status,
      category: filters.category,
      priority: filters.priority,
      page: filters.page,
      limit: filters.limit
    };
    dispatch(fetchAllComplaints(fetchParams));
  }, [dispatch, filters.status, filters.category, filters.priority, filters.page, filters.limit]);

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
    setShowUpdateModal(true);
  };

  const openViewModal = (complaint) => {
    setViewModalState({
      isOpen: true,
      complaint: complaint,
    });
  };

  const closeViewModal = () => {
    setViewModalState({
      isOpen: false,
      complaint: null,
    });
  };

  const closeModals = () => {
    setShowUpdateModal(false);
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
      toast.success('Complaint updated successfully!');
      closeModals();
    } catch (error) {
      toast.error(error || 'Failed to update complaint');
    }
  };

  const handleDeleteClick = (complaint) => {
    setDeleteConfirmState({
      isOpen: true,
      complaintId: complaint._id,
      complaintTitle: complaint.title,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmState.complaintId) return;
    
    setDeletingId(deleteConfirmState.complaintId);
    try {
      await dispatch(deleteComplaintAsync(deleteConfirmState.complaintId)).unwrap();
      toast.success('Complaint deleted successfully!');
      setDeleteConfirmState({ isOpen: false, complaintId: null, complaintTitle: '' });
    } catch (error) {
      toast.error(error || 'Failed to delete complaint');
    } finally {
      setDeletingId(null);
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
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      category: '',
      priority: '',
      search: '',
      page: 1,
      limit: 10
    });
  };

  const hasActiveFilters = filters.status || filters.category || filters.priority || filters.search;

  // Filter complaints by search
  const filteredComplaints = complaints.filter(complaint => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      complaint.title?.toLowerCase().includes(searchLower) ||
      complaint.description?.toLowerCase().includes(searchLower) ||
      complaint.address?.toLowerCase().includes(searchLower) ||
      complaint.userId?.name?.toLowerCase().includes(searchLower) ||
      complaint.userId?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && complaints.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                All Complaints
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage and track all user complaints
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-slate-200 mb-4 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, description, address, or user..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-slate-200 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-900 text-sm">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-slate-900 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500">
                {showFilters ? 'Hide' : 'Show'}
              </span>
            </button>

            {showFilters && (
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                      <option value="">All Categories</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Road">Road</option>
                      <option value="Street Light">Street Light</option>
                      <option value="Garbage">Garbage</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                      <option value="">All Priorities</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
                      Per Page
                    </label>
                    <select
                      value={filters.limit}
                      onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 text-sm text-slate-900 hover:text-slate-700 font-medium">
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mb-4 text-sm text-slate-600">
              Showing <span className="font-medium text-slate-900">{filteredComplaints.length}</span> of <span className="font-medium text-slate-900">{complaints.length}</span> complaints
            </div>
          )}

          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-base font-medium text-slate-900 mb-2">
                No complaints found
              </h3>
              <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                {complaints.length === 0
                  ? "No complaints have been submitted yet."
                  : "No complaints match your current filters."}
              </p>
              {complaints.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {complaint.images && complaint.images.length > 0 ? (
                          <div className="relative flex-shrink-0">
                            <img
                              src={complaint.images[0].url}
                              alt={complaint.title}
                              className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                            />
                            {complaint.images.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                +{complaint.images.length - 1}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-20 h-20 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-medium text-slate-900 mb-1.5">
                            {complaint.title}
                          </h3>
                          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                              {complaint.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              {complaint.userId?.name || 'Unknown'} ({complaint.userId?.email || 'N/A'})
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {complaint.address}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(complaint.createdAt)}
                            </span>
                            {complaint.images && complaint.images.length > 0 && (
                              <span className="flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" />
                                {complaint.images.length} image(s)
                              </span>
                            )}
                          </div>
                          {complaint.adminNotes && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-medium text-blue-900 mb-1">
                                Admin Notes:
                              </p>
                              <p className="text-xs text-blue-700">
                                {complaint.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => openViewModal(complaint)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                        title="View Details">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => openUpdateModal(complaint)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                        title="Update Complaint">
                        <Pencil className="w-4 h-4" />
                        <span className="hidden sm:inline">Update</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(complaint)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200 font-medium"
                        title="Delete Complaint">
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                Showing {filteredComplaints.length} of {total} complaints
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-slate-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ComplaintModal
        isOpen={viewModalState.isOpen}
        onClose={closeViewModal}
        mode="view"
        complaintData={viewModalState.complaint}
      />


      {showUpdateModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-slate-900">Update Complaint</h2>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-2">{selectedComplaint.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{selectedComplaint.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Category: {selectedComplaint.category}</span>
                  <span>•</span>
                  <span>Address: {selectedComplaint.address}</span>
                </div>
              </div>

              <div className="border-b border-slate-200 pb-4">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Submitted by:</span> {selectedComplaint.userId?.name} ({selectedComplaint.userId?.email})
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Date:</span> {formatDate(selectedComplaint.createdAt)}
                </p>
              </div>

              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={updateData.adminNotes}
                  onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
                  rows="4"
                  placeholder="Add notes about this complaint..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {selectedComplaint.adminNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">Previous Notes:</p>
                  <p className="text-sm text-amber-700">{selectedComplaint.adminNotes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
                {loading ? 'Updating...' : 'Update Complaint'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        onClose={() => setDeleteConfirmState({ isOpen: false, complaintId: null, complaintTitle: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Complaint"
        message={`Are you sure you want to delete "${deleteConfirmState.complaintTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deletingId === deleteConfirmState.complaintId}
      />
    </div>
  );
};

export default AdminComplaints;