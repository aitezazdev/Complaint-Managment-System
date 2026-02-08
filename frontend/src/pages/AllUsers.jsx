import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../services/authApi';
import { promoteToAdmin, demoteFromAdmin } from '../services/adminApi';

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
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">Manage all registered users</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-3xl font-semibold text-gray-900 mt-2">{users.length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Admins</p>
            <p className="text-3xl font-semibold text-purple-600 mt-2">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-600">Regular Users</p>
            <p className="text-3xl font-semibold text-blue-600 mt-2">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                        {user.role !== 'admin' ? (
                          <button
                            onClick={() => handlePromoteToAdmin(user._id, user.name)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemoteFromAdmin(user._id, user.name)}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                          >
                            Demote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{selectedUser.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <p className="text-sm text-gray-600 font-mono">{selectedUser._id}</p>
              </div>

              {selectedUser.createdAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
              )}

              {selectedUser.updatedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete User
              </button>
              
              <div className="flex space-x-3">
                {selectedUser.role !== 'admin' ? (
                  <button
                    onClick={() => {
                      handlePromoteToAdmin(selectedUser._id, selectedUser.name);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Promote to Admin
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleDemoteFromAdmin(selectedUser._id, selectedUser.name);
                      closeModal();
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700"
                  >
                    Demote to User
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
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