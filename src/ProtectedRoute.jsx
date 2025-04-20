
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return isLoggedIn ? children : <Navigate to="/register" />;
};

export default ProtectedRoute;
