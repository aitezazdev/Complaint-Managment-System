import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserComplaints from "./pages/UserComplaints";
import { Toaster } from "react-hot-toast";
import PageLoader from "./utils/Loading";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <PageLoader message="Initializing..." />;
  }

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
    <>
    <Toaster />
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
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/user/dashboard" replace />
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
          }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<div>Admin Users Page</div>} />
          <Route path="complaints" element={<div>Admin Complaints Page</div>} />
          <Route path="settings" element={<div>Admin Settings Page</div>} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="complaints" element={<UserComplaints />} />
          <Route path="new-complaint" element={<div>New Complaint Page</div>} />
          <Route path="profile" element={<div>User Profile Page</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
