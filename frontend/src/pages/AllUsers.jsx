import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../services/authApi';
import { promoteToAdmin, demoteFromAdmin } from '../services/adminApi';
import { User, Shield, Trash2, Eye, ChevronUp, ChevronDown, X } from 'lucide-react';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (window.confirm(`Are you sure you want to delete ${selectedUser.name}?`)) {
      try {
        await deleteUser(selectedUser._id);
        setUsers(users.filter(user => user._id !== selectedUser._id));
        closeModal();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handlePromoteToAdmin = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to promote ${userName} to admin?`)) {
      try {
        await promoteToAdmin(userId);
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: 'admin' } : user
        ));
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, role: 'admin' });
        }
      } catch (error) {
        console.error('Failed to promote user:', error);
        alert('Failed to promote user');
      }
    }
  };

  const handleDemoteFromAdmin = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to demote ${userName} to regular user?`)) {
      try {
        await demoteFromAdmin(userId);
        setUsers(users.map(user =>
          user._id === userId ? { ...user, role: 'user' } : user
        ));
        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({ ...selectedUser, role: 'user' });
        }
      } catch (error) {
        console.error('Failed to demote user:', error);
        alert('Failed to demote user');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin'
      ? 'bg-black text-white'
      : 'bg-gray-200 text-gray-800';
  };

  const getProfileImage = (user) => {
    if (user.profilePicture?.url) {
      return user.profilePicture.url;
    }
    return null;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-600">Manage all registered users and their permissions</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-black">{users.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-600 mb-1">Administrators</p>
            <p className="text-3xl font-bold text-black">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-5">
            <p className="text-sm font-medium text-gray-600 mb-1">Regular Users</p>
            <p className="text-3xl font-bold text-black">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {getProfileImage(user) ? (
                          <img
                            src={getProfileImage(user)}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role === 'user' && <User size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                          title="View Details"
                        >
                          <Eye size={18} className="text-gray-600 group-hover:text-black" />
                        </button>
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handlePromoteToAdmin(user._id, user.name)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Promote to Admin"
                          >
                            <ChevronUp size={18} className="text-gray-600 group-hover:text-black" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemoteFromAdmin(user._id, user.name)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Demote to User"
                          >
                            <ChevronDown size={18} className="text-gray-600 group-hover:text-black" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            handleDeleteUser();
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Delete User"
                        >
                          <Trash2 size={18} className="text-gray-600 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-500">
                    <User size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                {getProfileImage(selectedUser) ? (
                  <img
                    src={getProfileImage(selectedUser)}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600 mt-1">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role === 'admin' && <Shield size={14} />}
                    {selectedUser.role === 'user' && <User size={14} />}
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-200">
                    {selectedUser._id}
                  </p>
                </div>

                {selectedUser.createdAt && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Created At</label>
                    <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                )}

                {selectedUser.updatedAt && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                    <p className="text-gray-900">{new Date(selectedUser.updatedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-between items-center rounded-b-lg border-t border-gray-200">
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete User
              </button>

              <div className="flex gap-3">
                {selectedUser.role !== 'admin' ? (
                  <button
                    onClick={() => {
                      handlePromoteToAdmin(selectedUser._id, selectedUser.name);
                      closeModal();
                    }}
                    className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <ChevronUp size={16} />
                    Promote to Admin
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleDemoteFromAdmin(selectedUser._id, selectedUser.name);
                      closeModal();
                    }}
                    className="px-5 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <ChevronDown size={16} />
                    Demote to User
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;