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
  User,
  ChevronDown,
  AlertCircle
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

  // Search Aur Filter

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
// Complain Delete karne kelye
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600 font-medium">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                All Complaints
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Manage and track all user complaints
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-slate-900 ml-2">{total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 p-4 sm:p-5 transition-all hover:shadow-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, address, or user..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm sm:text-base transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden transition-all hover:shadow-md">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <Filter className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm sm:text-base">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-2 bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition-all">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition-all">
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
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition-all">
                    <option value="">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Per Page
                  </label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition-all">
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
                  className="mt-4 text-sm text-slate-900 hover:text-slate-700 font-semibold flex items-center gap-2 transition-colors">
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <div className="mb-4 px-1">
            <p className="text-sm text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredComplaints.length}</span> of <span className="font-bold text-slate-900">{complaints.length}</span> complaints
            </p>
          </div>
        )}

        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
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
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 p-4 sm:p-6 group">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Image */}
                      {complaint.images && complaint.images.length > 0 ? (
                        <div className="relative flex-shrink-0 w-full sm:w-24 h-48 sm:h-24">
                          <img
                            src={complaint.images[0].url}
                            alt={complaint.title}
                            className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm"
                          />
                          {complaint.images.length > 1 && (
                            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-lg">
                              +{complaint.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {complaint.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-sm ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 shadow-sm">
                            {complaint.category}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">
                              {complaint.userId?.name || 'Unknown'} ({complaint.userId?.email || 'N/A'})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{complaint.address}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              {formatDate(complaint.createdAt)}
                            </span>
                            {complaint.images && complaint.images.length > 0 && (
                              <span className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                                {complaint.images.length} image(s)
                              </span>
                            )}
                          </div>
                        </div>

                        {complaint.adminNotes && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-900 mb-1 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Admin Notes:
                            </p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                              {complaint.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-row lg:flex-col gap-2 sm:gap-2">
                    <button
                      onClick={() => openViewModal(complaint)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-200 font-semibold shadow-sm hover:shadow"
                      title="View Details">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openUpdateModal(complaint)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all border border-blue-200 font-semibold shadow-sm hover:shadow"
                      title="Update Complaint">
                      <Pencil className="w-4 h-4" />
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(complaint)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all border border-rose-200 font-semibold shadow-sm hover:shadow"
                      title="Delete Complaint">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-700 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredComplaints.length}</span> of <span className="font-bold text-slate-900">{total}</span> complaints
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-slate-700 font-medium">
                Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ComplaintModal
        isOpen={viewModalState.isOpen}
        onClose={closeViewModal}
        mode="view"
        complaintData={viewModalState.complaint}
      />

      {showUpdateModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Update Complaint</h2>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2 text-base">{selectedComplaint.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{selectedComplaint.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold">Category:</span> {selectedComplaint.category}
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedComplaint.address}
                  </span>
                </div>
              </div>

              <div className="border-b border-slate-200 pb-4 space-y-2">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Submitted by:</span> {selectedComplaint.userId?.name} ({selectedComplaint.userId?.email})
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Date:</span> {formatDate(selectedComplaint.createdAt)}
                </p>
              </div>

              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Attached Images ({selectedComplaint.images.length})
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedComplaint.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Complaint ${index + 1}`}
                        className="w-full h-24 sm:h-28 object-cover rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm transition-all">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-rose-500">*</span>
                </label>
                <select
                  value={updateData.priority}
                  onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm transition-all">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={updateData.adminNotes}
                  onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
                  rows="4"
                  placeholder="Add notes about this complaint..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm resize-none transition-all"
                />
              </div>

              {selectedComplaint.adminNotes && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Previous Notes:
                  </p>
                  <p className="text-sm text-amber-700 leading-relaxed">{selectedComplaint.adminNotes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-slate-50 rounded-b-2xl">
              <button
                onClick={closeModals}
                className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-white transition-all shadow-sm">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl">
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