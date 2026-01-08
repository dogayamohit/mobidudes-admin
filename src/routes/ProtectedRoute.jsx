import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Not authenticated
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // Authenticated
  return <Outlet />;
};

export default ProtectedRoute;
