import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/auth';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-6 py-8 border-b border-slate-200">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Complaint Portal
          </h1>
          <p className="text-sm text-slate-500 mt-1">Administration</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            User Management
          </NavLink>

          <NavLink
            to="/admin/complaints"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            All Complaints
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            System Settings
          </NavLink>
        </nav>

        <div className="px-3 py-4 border-t border-slate-200">
          <div className="px-4 py-3 mb-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Administrator
            </p>
            <p className="text-sm font-medium text-slate-900 mt-1 truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {user?.email || ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;