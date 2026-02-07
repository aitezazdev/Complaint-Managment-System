import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

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
              <h1 className="text-2xl font-bold text-center mt-10">
                Dashboard
              </h1>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
  );
}

export default App;
