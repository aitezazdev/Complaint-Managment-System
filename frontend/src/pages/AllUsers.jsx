import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../services/authApi';
import { promoteToAdmin, demoteFromAdmin } from '../services/adminApi';
import { User, Shield, Trash2, Eye, ChevronUp, ChevronDown, X, Search, Users, UserCog } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState({ 
    isOpen: false, 
    user: null,
    loading: false 
  });
  const [promoteConfirm, setPromoteConfirm] = useState({
    isOpen: false,
    user: null,
    loading: false
  });
  const [demoteConfirm, setDemoteConfirm] = useState({
    isOpen: false,
    user: null,
    loading: false
  });

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
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirm.user) return;

    setDeleteConfirm(prev => ({ ...prev, loading: true }));
    
    try {
      await deleteUser(deleteConfirm.user._id);
      setUsers(users.filter(user => user._id !== deleteConfirm.user._id));
      toast.success(`${deleteConfirm.user.name} deleted successfully`);
      setDeleteConfirm({ isOpen: false, user: null, loading: false });
      if (selectedUser?._id === deleteConfirm.user._id) {
        closeModal();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!promoteConfirm.user) return;

    setPromoteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await promoteToAdmin(promoteConfirm.user._id);
      setUsers(users.map(user =>
        user._id === promoteConfirm.user._id ? { ...user, role: 'admin' } : user
      ));
      if (selectedUser && selectedUser._id === promoteConfirm.user._id) {
        setSelectedUser({ ...selectedUser, role: 'admin' });
      }
      toast.success(`${promoteConfirm.user.name} promoted to admin`);
      setPromoteConfirm({ isOpen: false, user: null, loading: false });
    } catch (error) {
      console.error('Failed to promote user:', error);
      toast.error('Failed to promote user');
      setPromoteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDemoteFromAdmin = async () => {
    if (!demoteConfirm.user) return;

    setDemoteConfirm(prev => ({ ...prev, loading: true }));

    try {
      await demoteFromAdmin(demoteConfirm.user._id);
      setUsers(users.map(user =>
        user._id === demoteConfirm.user._id ? { ...user, role: 'user' } : user
      ));
      if (selectedUser && selectedUser._id === demoteConfirm.user._id) {
        setSelectedUser({ ...selectedUser, role: 'user' });
      }
      toast.success(`${demoteConfirm.user.name} demoted to user`);
      setDemoteConfirm({ isOpen: false, user: null, loading: false });
    } catch (error) {
      console.error('Failed to demote user:', error);
      toast.error('Failed to demote user');
      setDemoteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin'
      ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg'
      : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800';
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

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-slate-200 border-t-slate-900 mx-auto mb-4"></div>
          <p className="text-sm text-slate-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Manage all registered users and their permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Administrators</p>
                <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full"></div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <UserCog className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Regular Users</p>
                <p className="text-3xl font-bold text-slate-900">{stats.regularUsers}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-white transition-all">
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          {(searchQuery || filterRole !== 'all') && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Showing <span className="font-bold text-slate-900">{filteredUsers.length}</span> of <span className="font-bold text-slate-900">{users.length}</span> users
              </p>
            </div>
          )}
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getProfileImage(user) ? (
                            <img
                              src={getProfileImage(user)}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-slate-700">{user.email}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role === 'admin' && <Shield size={12} />}
                          {user.role === 'user' && <User size={12} />}
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
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
                            className="p-2 hover:bg-slate-100 rounded-lg transition-all group"
                            title="View Details"
                          >
                            <Eye size={18} className="text-slate-600 group-hover:text-slate-900" />
                          </button>
                          {user.role !== 'admin' ? (
                            <button
                              onClick={() => setPromoteConfirm({ isOpen: true, user, loading: false })}
                              className="p-2 hover:bg-emerald-50 rounded-lg transition-all group"
                              title="Promote to Admin"
                            >
                              <ChevronUp size={18} className="text-slate-600 group-hover:text-emerald-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() => setDemoteConfirm({ isOpen: true, user, loading: false })}
                              className="p-2 hover:bg-amber-50 rounded-lg transition-all group"
                              title="Demote to User"
                            >
                              <ChevronDown size={18} className="text-slate-600 group-hover:text-amber-600" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm({ isOpen: true, user, loading: false })}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-all group"
                            title="Delete User"
                          >
                            <Trash2 size={18} className="text-slate-600 group-hover:text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <User size={40} className="text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-900 mb-2">No users found</p>
                      <p className="text-sm text-slate-600">
                        {searchQuery || filterRole !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'No users have registered yet'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile & Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start gap-4 mb-4">
                  {getProfileImage(user) ? (
                    <img
                      src={getProfileImage(user)}
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">{user.name}</h3>
                    <p className="text-sm text-slate-600 mb-2 truncate">{user.email}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role === 'user' && <User size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                      {user.createdAt && (
                        <span className="text-xs text-slate-500">
                          Joined {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  
                  {user.role !== 'admin' ? (
                    <button
                      onClick={() => setPromoteConfirm({ isOpen: true, user, loading: false })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-200"
                    >
                      <ChevronUp size={16} />
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => setDemoteConfirm({ isOpen: true, user, loading: false })}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all border border-amber-200"
                    >
                      <ChevronDown size={16} />
                      Demote
                    </button>
                  )}
                  
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, user, loading: false })}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-700 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all border border-rose-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <User size={40} className="text-slate-300" />
              </div>
              <p className="font-semibold text-slate-900 mb-2">No users found</p>
              <p className="text-sm text-slate-600">
                {searchQuery || filterRole !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No users have registered yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">User Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* User Profile Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                {getProfileImage(selectedUser) ? (
                  <img
                    src={getProfileImage(selectedUser)}
                    alt={selectedUser.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-slate-200 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{selectedUser.name}</h3>
                  <p className="text-slate-600 mb-2">{selectedUser.email}</p>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                    {selectedUser.role === 'admin' && <Shield size={14} />}
                    {selectedUser.role === 'user' && <User size={14} />}
                    {selectedUser.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">User ID</label>
                  <p className="text-sm text-slate-600 font-mono bg-slate-50 p-3 rounded-lg border border-slate-200 break-all">
                    {selectedUser._id}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedUser.createdAt && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Created At</label>
                      <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {new Date(selectedUser.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}

                  {selectedUser.updatedAt && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Last Updated</label>
                      <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {new Date(selectedUser.updatedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirm({ isOpen: true, user: selectedUser, loading: false });
                  }}
                  className="px-5 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Trash2 size={16} />
                  Delete User
                </button>

                <div className="flex flex-col sm:flex-row gap-3">
                  {selectedUser.role !== 'admin' ? (
                    <button
                      onClick={() => {
                        setPromoteConfirm({ isOpen: true, user: selectedUser, loading: false });
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <ChevronUp size={16} />
                      Promote to Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDemoteConfirm({ isOpen: true, user: selectedUser, loading: false });
                      }}
                      className="px-5 py-2.5 bg-slate-600 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <ChevronDown size={16} />
                      Demote to User
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 border-2 border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-white transition-all shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, user: null, loading: false })}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={deleteConfirm.user ? `Are you sure you want to delete ${deleteConfirm.user.name}? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleteConfirm.loading}
      />

      {/* Promote Confirmation Dialog */}
      <ConfirmDialog
        isOpen={promoteConfirm.isOpen}
        onClose={() => setPromoteConfirm({ isOpen: false, user: null, loading: false })}
        onConfirm={handlePromoteToAdmin}
        title="Promote to Admin"
        message={promoteConfirm.user ? `Are you sure you want to promote ${promoteConfirm.user.name} to admin? They will have full administrative privileges.` : ''}
        confirmText="Promote"
        cancelText="Cancel"
        type="warning"
        loading={promoteConfirm.loading}
      />

      {/* Demote Confirmation Dialog */}
      <ConfirmDialog
        isOpen={demoteConfirm.isOpen}
        onClose={() => setDemoteConfirm({ isOpen: false, user: null, loading: false })}
        onConfirm={handleDemoteFromAdmin}
        title="Demote to User"
        message={demoteConfirm.user ? `Are you sure you want to demote ${demoteConfirm.user.name} to regular user? They will lose all administrative privileges.` : ''}
        confirmText="Demote"
        cancelText="Cancel"
        type="warning"
        loading={demoteConfirm.loading}
      />
    </div>
  );
};

export default AllUsers;