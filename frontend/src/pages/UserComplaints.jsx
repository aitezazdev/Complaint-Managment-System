import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchUserComplaints,
  deleteComplaintAsync,
  clearError,
} from "../store/slice/complaint";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { PageLoader, InlineLoader } from "../utils/Loading";

const UserComplaints = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { userComplaints, userComplaintsLoaded, loading, error } = useSelector(
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
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    complaintId: null,
  });

  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Filter complaints based on all criteria
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

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteComplaintAsync(id)).unwrap();
      toast.success("Complaint deleted successfully");
      setDeleteModal({ isOpen: false, complaintId: null });
    } catch (error) {
      toast.error(error || "Failed to delete complaint");
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
        return "bg-gray-50 text-gray-700 border-gray-200";
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
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  const canDelete = (complaint) => {
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
    return <PageLoader message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Complaints
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track all your submitted complaints
              </p>
            </div>
            <button
              onClick={() => navigate("/user/new-complaint")}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
              <FiPlus className="w-4 h-4" />
              New Complaint
            </button>
          </div>
        </div>

        <div className="px-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or address..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({ ...filters, search: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <FiFilter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900 text-sm">
                  Filters
                </span>
                {hasActiveFilters && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {showFilters ? "Hide" : "Show"}
              </span>
            </button>

            {showFilters && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">All Categories</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Water Supply">Water Supply</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Roads">Roads</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Noise Pollution">Noise Pollution</option>
                      <option value="Garbage Collection">
                        Garbage Collection
                      </option>
                      <option value="Street Lighting">Street Lighting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) =>
                        setFilters({ ...filters, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                    className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <FiX className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          {hasActiveFilters && (
            <div className="mb-4 text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredComplaints.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {userComplaints.length}
              </span>{" "}
              complaints
            </div>
          )}

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-300 text-5xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No complaints found
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {userComplaints.length === 0
                  ? "You haven't submitted any complaints yet."
                  : "No complaints match your current filters."}
              </p>
              {userComplaints.length === 0 ? (
                <button
                  onClick={() => navigate("/user/new-complaint")}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                  <FiPlus className="w-4 h-4" />
                  Submit Your First Complaint
                </button>
              ) : (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <FiX className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {complaint.images && complaint.images.length > 0 && (
                          <img
                            src={complaint.images[0].url}
                            alt={complaint.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 mb-1.5">
                            {complaint.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {complaint.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                                complaint.status,
                              )}`}>
                              {complaint.status}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(
                                complaint.priority,
                              )}`}>
                              {complaint.priority}
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                              {complaint.category}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              📍 {complaint.address}
                            </span>
                            <span className="flex items-center gap-1">
                              📅 {formatDate(complaint.createdAt)}
                            </span>
                            {complaint.images &&
                              complaint.images.length > 0 && (
                                <span className="flex items-center gap-1">
                                  🖼️ {complaint.images.length} image(s)
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

                    {/* Right Section - Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() =>
                          navigate(`/user/complaint/${complaint._id}`)
                        }
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                        title="View Details">
                        <FiEye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      {canEdit(complaint) && (
                        <button
                          onClick={() =>
                            navigate(`/user/complaint/edit/${complaint._id}`)
                          }
                          className="flex items-center gap-1.5 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
                          title="Edit Complaint">
                          <FiEdit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      )}
                      {canDelete(complaint) && (
                        <button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              complaintId: complaint._id,
                            })
                          }
                          className="flex items-center gap-1.5 px-3 py-2 text-sm text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors border border-rose-100"
                          title="Delete Complaint">
                          <FiTrash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Complaint
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this complaint? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, complaintId: null })
                }
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.complaintId)}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <InlineLoader text="Deleting..." /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComplaints;
