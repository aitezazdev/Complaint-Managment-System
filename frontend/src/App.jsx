import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  
  console.log(user);

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
      
      {/* Main Dashboard Route - Redirects based on role */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/user/dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Admin Dashboard - Protected */}
      <Route
        path="/admin/dashboard"
        element={
          isAuthenticated && isAdmin ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* User Dashboard - Protected */}
      <Route
        path="/user/dashboard"
        element={
          isAuthenticated && isUser ? (
            <UserDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;