// layouts/UserLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/auth';
const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">User Portal</h2>
        </div>
        
        <nav className="mt-8">
          <NavLink
            to="/user/complaints"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-blue-700 ${
                isActive ? 'bg-blue-700 border-l-4 border-white' : ''
              }`
            }
          >
            My Complaints
          </NavLink>
          
          <NavLink
            to="/user/new-complaint"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-blue-700 ${
                isActive ? 'bg-blue-700 border-l-4 border-white' : ''
              }`
            }
          >
            New Complaint
          </NavLink>
          
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-blue-700 ${
                isActive ? 'bg-blue-700 border-l-4 border-white' : ''
              }`
            }
          >
            Profile
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;