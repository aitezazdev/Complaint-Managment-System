import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCurrentUserProfile,
  updateUserAsync,
  clearError,
  deleteUserAsync,
} from "../store/slice/user";
import { logout } from "../store/slice/auth";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiFileText,
  FiAlertCircle,
  FiLogOut,
  FiClock,
  FiCalendar,
  FiLock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { PageLoader } from "../utils/Loading";
import ConfirmDialog from "../components/ConfirmDialog";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUserProfile, profileLoaded, loading, error } = useSelector(
    (state) => state.user,
  );
  const { user: authUser } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentUserProfile) {
      setFormData({
        name: currentUserProfile.name || "",
        email: currentUserProfile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfilePicturePreview(currentUserProfile.profilePicture?.url || "");
    }
  }, [currentUserProfile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfilePicture(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(currentUserProfile?.profilePicture?.url || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    if (showPasswordFields) {
      if (!formData.newPassword) {
        toast.error("Please enter new password");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("email", formData.email);

      if (showPasswordFields && formData.newPassword) {
        updateData.append("password", formData.newPassword);
      }

      if (profilePicture) {
        updateData.append("profilePicture", profilePicture);
      }

      await dispatch(
        updateUserAsync({ id: currentUserProfile._id, data: updateData }),
      ).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setShowPasswordFields(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setProfilePicture(null);

      dispatch(fetchCurrentUserProfile());
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordFields(false);
    setFormData({
      name: currentUserProfile.name || "",
      email: currentUserProfile.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setProfilePicture(null);
    setProfilePicturePreview(currentUserProfile?.profilePicture?.url || "");
  };

  const handleDeleteAccount = () => {
    setDeleteAccountOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await dispatch(deleteUserAsync(currentUserProfile._id)).unwrap();

      toast.success("Your account has been deleted.");

      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
      setDeleteAccountOpen(false);
    }
  };

  if (!profileLoaded) {
    return <PageLoader message="Loading profile..." />;
  }

  const isAdmin = currentUserProfile?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all text-sm font-semibold shadow-lg hover:shadow-xl">
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 border-2 border-rose-200 px-5 py-2.5 rounded-lg hover:bg-rose-50 transition-all text-sm font-semibold shadow-sm hover:shadow">
                    <FiLogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Profile Header */}
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl ring-4 ring-slate-100"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border-4 border-white shadow-xl ring-4 ring-slate-100">
                      <span className="text-white font-bold text-4xl sm:text-5xl">
                        {currentUserProfile?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="profilePicture"
                        className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-800 transition-all cursor-pointer shadow-lg hover:scale-110">
                        <FiCamera className="w-5 h-5" />
                      </label>
                      {profilePicture && (
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all shadow-lg hover:scale-110">
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {currentUserProfile?.name}
                  </h2>
                  <p className="text-slate-600 mt-1 flex items-center justify-center sm:justify-start gap-2">
                    <FiMail className="w-4 h-4" />
                    {currentUserProfile?.email}
                  </p>
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-lg ${
                      currentUserProfile?.role === "admin"
                        ? "bg-gradient-to-r from-slate-900 to-slate-700 text-white"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    }`}>
                      <FiShield className="w-4 h-4" />
                      {currentUserProfile?.role === "admin"
                        ? "Administrator"
                        : "User"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-slate-700" />
                  </div>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition disabled:bg-slate-50 disabled:text-slate-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition disabled:bg-slate-50 disabled:text-slate-500 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Complaint Statistics */}
              {!isAdmin && currentUserProfile?.statistics && (
                <div className="pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FiFileText className="w-4 h-4 text-blue-700" />
                    </div>
                    Complaint Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="p-4 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl hover:shadow-lg transition-all">
                      <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Total</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                        {currentUserProfile.statistics.totalComplaints}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl hover:shadow-lg transition-all">
                      <p className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">Pending</p>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-900">
                        {currentUserProfile.statistics.pending}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl hover:shadow-lg transition-all">
                      <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">In Progress</p>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                        {currentUserProfile.statistics.inProgress}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl hover:shadow-lg transition-all">
                      <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wider">Resolved</p>
                      <p className="text-2xl sm:text-3xl font-bold text-emerald-900">
                        {currentUserProfile.statistics.resolved}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-xl hover:shadow-lg transition-all">
                      <p className="text-xs font-semibold text-rose-700 mb-2 uppercase tracking-wider">Rejected</p>
                      <p className="text-2xl sm:text-3xl font-bold text-rose-900">
                        {currentUserProfile.statistics.rejected}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Change Password Section */}
              {isEditing && (
                <div className="pt-8 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <FiLock className="w-4 h-4 text-amber-700" />
                      </div>
                      Change Password
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-sm text-slate-900 hover:text-slate-700 font-semibold transition-colors">
                      {showPasswordFields ? "Cancel" : "Change Password"}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                          Leave password fields empty to keep your current password. New password must be at least 6 characters.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                          placeholder="Enter new password"
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                          placeholder="Confirm new password"
                          minLength={6}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Account Information */}
              <div className="pt-8 border-t border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCalendar className="w-4 h-4 text-emerald-700" />
                  </div>
                  Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      Member Since
                    </p>
                    <p className="font-bold text-slate-900">
                      {new Date(currentUserProfile?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Last Updated
                    </p>
                    <p className="font-bold text-slate-900">
                      {new Date(currentUserProfile?.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-all font-semibold shadow-sm">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={deleteAccountOpen}
        onClose={() => !deletingAccount && setDeleteAccountOpen(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
        loading={deletingAccount}
      />
    </div>
  );
};

export default UserProfile;