import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchUserComplaints,
  deleteComplaintAsync,
  clearError,
} from "../store/slice/complaint";
import { toast } from "react-hot-toast";
import { PageLoader } from "../utils/Loading";
import ComplaintModal from "../components/ComplaintModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
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
  FileText
} from "lucide-react";

const UserComplaints = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { userComplaints, userComplaintsLoaded, error } = useSelector(
    (state) => state.complaint,
  );

  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filters, setFilters] = useState({
    status: searchParams.get("status") || "",
    category: searchParams.get("category") || "",
    priority: searchParams.get("priority") || "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    complaint: null,
  });

  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    complaintId: null,
    complaintTitle: '',
  });

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    let filtered = [...userComplaints];

    if (filters.status) {
      filtered = filtered.filter((c) => c.status === filters.status);
    }
    if (filters.category) {
      filtered = filtered.filter((c) => c.category === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter((c) => c.priority === filters.priority);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.address.toLowerCase().includes(searchLower),
      );
    }

    setFilteredComplaints(filtered);
  }, [userComplaints, filters]);

  const openModal = (mode, complaint = null) => {
    setModalState({
      isOpen: true,
      mode,
      complaint,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
      complaint: null,
    });
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
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
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

  const canEdit = (complaint) => {
    return complaint.status === "Pending";
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      category: "",
      priority: "",
      search: "",
    });
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.status || filters.category || filters.priority || filters.search;

  if (!userComplaintsLoaded) {
    return <PageLoader message="Loading complaints..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                My Complaints
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage and track all your submitted complaints
              </p>
            </div>
            <button
              onClick={() => openModal('create')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
              Submit Complaint
            </button>
          </div>
        </div>

        <div className="px-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-slate-200 mb-4 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, description, or address..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: "" })}
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
                <span className="font-medium text-slate-900 text-sm">
                  Filters
                </span>
                {hasActiveFilters && (
                  <span className="bg-slate-900 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-500">
                {showFilters ? "Hide" : "Show"}
              </span>
            </button>

            {showFilters && (
              <div className="p-4 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5 uppercase tracking-wider">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFilters({ ...filters, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
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

          {/* Results Summary */}
          {hasActiveFilters && (
            <div className="mb-4 text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredComplaints.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {userComplaints.length}
              </span>{" "}
              complaints
            </div>
          )}

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-base font-medium text-slate-900 mb-2">
                No complaints found
              </h3>
              <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                {userComplaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "No complaints match your current filters."}
              </p>
              {userComplaints.length === 0 ? (
                <button
                  onClick={() => openModal('create')}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                  Submit Your First Complaint
                </button>
              ) : (
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
                        onClick={() => openModal('view', complaint)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                        title="View Details">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      {canEdit(complaint) && (
                        <>
                          <button
                            onClick={() => openModal('edit', complaint)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                            title="Edit Complaint">
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(complaint)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200 font-medium"
                            title="Delete Complaint">
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ComplaintModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        complaintData={modalState.complaint}
      />

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

export default UserComplaints;