import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            user?.role === "admin" ? (
              <Navigate to="/admin/users" replace />
            ) : (
              <Navigate to="/user/complaints" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<div>Admin Users Page</div>} />
        <Route path="complaints" element={<div>Admin Complaints Page</div>} />
        <Route path="settings" element={<div>Admin Settings Page</div>} />
        <Route index element={<Navigate to="/admin/users" replace />} />
      </Route>

      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="complaints" element={<div>User Complaints Page</div>} />
        <Route path="new-complaint" element={<div>New Complaint Page</div>} />
        <Route path="profile" element={<div>User Profile Page</div>} />
        <Route index element={<Navigate to="/user/complaints" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;