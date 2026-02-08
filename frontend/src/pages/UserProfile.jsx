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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Profile
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm">
                    <FiLogOut className="w-4 h-4" />
                    Delete Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="px-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <span className="text-white font-bold text-5xl">
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
                          className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer shadow-lg">
                          <FiCamera className="w-5 h-5" />
                        </label>
                        {profilePicture && (
                          <button
                            type="button"
                            onClick={removeProfilePicture}
                            className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                            <FiX className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentUserProfile?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {currentUserProfile?.email}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        <FiShield className="w-4 h-4" />
                        {currentUserProfile?.role === "admin"
                          ? "Administrator"
                          : "User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:text-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {currentUserProfile?.statistics && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FiFileText className="w-5 h-5 text-blue-600" />
                      Complaint Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {currentUserProfile.statistics.totalComplaints}
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-xs text-amber-700 mb-1">Pending</p>
                        <p className="text-2xl font-bold text-amber-700">
                          {currentUserProfile.statistics.pending}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-700 mb-1">
                          In Progress
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {currentUserProfile.statistics.inProgress}
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <p className="text-xs text-emerald-700 mb-1">
                          Resolved
                        </p>
                        <p className="text-2xl font-bold text-emerald-700">
                          {currentUserProfile.statistics.resolved}
                        </p>
                      </div>
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                        <p className="text-xs text-rose-700 mb-1">Rejected</p>
                        <p className="text-2xl font-bold text-rose-700">
                          {currentUserProfile.statistics.rejected}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-blue-600" />
                        Change Password
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordFields(!showPasswordFields)
                        }
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        {showPasswordFields ? "Cancel" : "Change Password"}
                      </button>
                    </div>

                    {showPasswordFields && (
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            Leave password fields empty to keep your current
                            password
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Enter new password"
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            placeholder="Confirm new password"
                            minLength={6}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Member Since</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(
                          currentUserProfile?.createdAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Updated</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {new Date(
                          currentUserProfile?.updatedAt,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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
      </div>

      <ConfirmDialog
        isOpen={deleteAccountOpen}
        onClose={() => !deletingAccount && setDeleteAccountOpen(false)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message={
          deletingAccount
            ? "Deleting your account..."
            : "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
        }
        confirmText={
          deletingAccount ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </div>
          ) : (
            "Delete Account"
          )
        }
        cancelText="Cancel"
        type="danger"
        disableConfirm={deletingAccount}
      />
    </div>
  );
};

export default UserProfile;
