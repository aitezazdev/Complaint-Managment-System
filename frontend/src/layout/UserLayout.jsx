import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slice/auth.js';
import ComplaintModal from '../components/ComplaintModal.jsx';

const UserLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            to="/user/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 hover:bg-blue-700 ${
                isActive ? 'bg-blue-700 border-l-4 border-white' : ''
              }`
            }
          >
            Dashboard
          </NavLink>
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
          <button
            onClick={handleOpenModal}
            className="w-full text-left block px-4 py-3 hover:bg-blue-700"
          >
            New Complaint
          </button>
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

      <main className={`flex-1 overflow-y-auto ${isModalOpen ? 'blur-sm' : ''}`}>
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      {/* Create Complaint Modal */}
      <ComplaintModal isOpen={isModalOpen} onClose={handleCloseModal} mode="create" />
    </div>
  );
};

export default UserLayout;