import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserComplaints } from "../store/slice/complaint";
import { PageLoader } from "../utils/Loading";
import ComplaintModal from "../components/ComplaintModal.jsx";
import { MapPin, Calendar, Eye, Pencil, FileText } from "lucide-react";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userComplaints, userComplaintsLoaded } = useSelector((state) => state.complaint);
  const { user } = useSelector((state) => state.auth);

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create',
    complaint: null,
  });

  useEffect(() => {
    dispatch(fetchUserComplaints());
  }, [dispatch]);

  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter((c) => c.status === "Pending").length,
    inProgress: userComplaints.filter((c) => c.status === "In Progress").length,
    resolved: userComplaints.filter((c) => c.status === "Resolved").length,
    rejected: userComplaints.filter((c) => c.status === "Rejected").length,
  };

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
        return "bg-slate-50 text-slate-700 border-slate-200";
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Track and manage your complaints
              </p>
            </div>
            <button
              onClick={() => openModal('create')}
              className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
              Submit Complaint
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                Total
              </p>
              <p className="text-2xl font-semibold text-slate-900">
                {stats.total}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                Pending
              </p>
              <p className="text-2xl font-semibold text-amber-600">
                {stats.pending}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                In Progress
              </p>
              <p className="text-2xl font-semibold text-blue-600">
                {stats.inProgress}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                Resolved
              </p>
              <p className="text-2xl font-semibold text-emerald-600">
                {stats.resolved}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-2">
                Rejected
              </p>
              <p className="text-2xl font-semibold text-rose-600">
                {stats.rejected}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Activity
                  </h2>
                  {userComplaints.length > 0 && (
                    <button
                      onClick={() => navigate("/user/complaints")}
                      className="text-sm text-slate-900 hover:text-slate-700 font-medium transition-colors">
                      View All
                    </button>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {recentComplaints.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-base font-medium text-slate-900 mb-2">
                      No complaints yet
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 max-w-sm mx-auto">
                      Submit your first complaint to start tracking issues and resolutions
                    </p>
                    <button
                      onClick={() => openModal('create')}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                      Submit First Complaint
                    </button>
                  </div>
                ) : (
                  recentComplaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="p-5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            {complaint.images && complaint.images.length > 0 ? (
                              <div className="relative flex-shrink-0">
                                <img
                                  src={complaint.images[0].url}
                                  alt={complaint.title}
                                  className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                                />
                                {complaint.images.length > 1 && (
                                  <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                                    +{complaint.images.length - 1}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-14 h-14 flex-shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-slate-900 mb-1 text-sm">
                                {complaint.title}
                              </h3>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                                {complaint.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                                  {complaint.status}
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                                  {complaint.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {complaint.address}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(complaint.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => openModal('view', complaint)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                            title="View Details">
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          {canEdit(complaint) && (
                            <button
                              onClick={() => openModal('edit', complaint)}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200 font-medium"
                              title="Edit Complaint">
                              <Pencil className="w-4 h-4" />
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

            {/* Sidebar */}
            <div className="space-y-6">
              {userComplaints.length > 0 && (
                <>
                  {/* Status Distribution */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">
                      Status Breakdown
                    </h2>
                    <div className="space-y-3">
                      {[
                        { label: 'Pending', value: stats.pending, color: 'bg-amber-500' },
                        { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500' },
                        { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-500' },
                        { label: 'Rejected', value: stats.rejected, color: 'bg-rose-500' }
                      ].map((item) => {
                        const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
                        return (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-slate-700 font-medium">{item.label}</span>
                              <span className="text-slate-600">{item.value}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`${item.color} h-1.5 rounded-full transition-all duration-500`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Summary */}
                  <div className="bg-white rounded-lg border border-slate-200 p-5">
                    <h2 className="text-base font-semibold text-slate-900 mb-4">
                      Summary
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Total Submitted</span>
                        <span className="text-sm font-semibold text-slate-900">{stats.total}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Active Cases</span>
                        <span className="text-sm font-semibold text-blue-600">
                          {stats.pending + stats.inProgress}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-slate-100">
                        <span className="text-sm text-slate-600">Completed</span>
                        <span className="text-sm font-semibold text-emerald-600">{stats.resolved}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Resolution Rate</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : "0%"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

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