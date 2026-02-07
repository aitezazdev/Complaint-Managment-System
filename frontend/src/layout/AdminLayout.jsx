// layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/auth';
const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="mt-8">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`
            }
          >
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`
            }
          >
            Users
          </NavLink>
          
          <NavLink
            to="/admin/complaints"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`
            }
          >
            Complaints
          </NavLink>
          
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-gray-700 ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`
            }
          >
            Settings
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;