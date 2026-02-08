import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserComplaints } from "../store/slice/complaint";
import {
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiTrendingUp,
  FiEye,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { PageLoader } from "../utils/Loading";
import ComplaintModal from "../components/ComplaintModal.jsx";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userComplaints, userComplaintsLoaded } = useSelector((state) => state.complaint);
  const { user } = useSelector((state) => state.auth);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create', 'view', 'edit'
    complaint: null,
  });

  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);

  // Calculate statistics
  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter((c) => c.status === "Pending").length,
    inProgress: userComplaints.filter((c) => c.status === "In Progress").length,
    resolved: userComplaints.filter((c) => c.status === "Resolved").length,
    rejected: userComplaints.filter((c) => c.status === "Rejected").length,
  };

  // Get recent complaints (last 5)
  const recentComplaints = [...userComplaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canEdit = (complaint) => {
    return complaint.status === "Pending";
  };

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
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Here's an overview of your complaints
              </p>
            </div>
            <button
              onClick={() => openModal('create')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
              <FiPlus className="w-4 h-4" />
              New Complaint
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <FiFileText className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-gray-900 mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-600">Total Complaints</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <FiClock className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-amber-600 mb-1">
                {stats.pending}
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>

            {/* In Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiTrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-blue-600 mb-1">
                {stats.inProgress}
              </p>
              <p className="text-xs text-gray-600">In Progress</p>
            </div>

            {/* Resolved */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-emerald-600 mb-1">
                {stats.resolved}
              </p>
              <p className="text-xs text-gray-600">Resolved</p>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <FiAlertCircle className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-rose-600 mb-1">
                {stats.rejected}
              </p>
              <p className="text-xs text-gray-600">Rejected</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Complaints - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  {userComplaints.length > 0 && (
                    <button
                      onClick={() => navigate("/user/complaints")}
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {recentComplaints.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="text-gray-300 text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No complaints yet
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      You haven't submitted any complaints yet. Get started by
                      submitting your first complaint.
                    </p>
                    <button
                      onClick={() => openModal('create')}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                      <FiPlus className="w-4 h-4" />
                      Submit First Complaint
                    </button>
                  </div>
                ) : (
                  recentComplaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            {/* Image or Placeholder */}
                            {complaint.images && complaint.images.length > 0 ? (
                              <div className="relative flex-shrink-0">
                                <img
                                  src={complaint.images[0].url}
                                  alt={complaint.title}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                />
                                {complaint.images.length > 1 && (
                                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                    +{complaint.images.length - 1}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-16 h-16 flex-shrink-0 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <svg
                                  className="w-7 h-7 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {complaint.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                {complaint.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                                    complaint.status,
                                  )}`}>
                                  {complaint.status}
                                </span>
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                  {complaint.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>📍 {complaint.address}</span>
                                <span>
                                  📅 {formatDate(complaint.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openModal('view', complaint)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
                            title="View Details">
                            <FiEye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          {canEdit(complaint) && (
                            <button
                              onClick={() => openModal('edit', complaint)}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
                              title="Edit Complaint">
                              <FiEdit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Status Overview - Takes 1 column */}
            <div className="space-y-6">
              {/* Status Distribution */}
              {userComplaints.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Status Distribution
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-gray-700">Pending</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {stats.pending}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (stats.pending / stats.total) * 100
                                  : 0
                              }%`,
                            }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-700">
                          In Progress
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {stats.inProgress}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (stats.inProgress / stats.total) * 100
                                  : 0
                              }%`,
                            }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-gray-700">Resolved</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {stats.resolved}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (stats.resolved / stats.total) * 100
                                  : 0
                              }%`,
                            }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-sm text-gray-700">Rejected</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900">
                          {stats.rejected}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-rose-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (stats.rejected / stats.total) * 100
                                  : 0
                              }%`,
                            }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats Summary */}
              {userComplaints.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        Total Submitted
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {stats.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Active</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {stats.pending + stats.inProgress}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        {stats.resolved}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">
                        Resolution Rate
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {stats.total > 0
                          ? `${Math.round((stats.resolved / stats.total) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        complaintData={modalState.complaint}
      />
    </div>
  );
};

export default UserDashboard;