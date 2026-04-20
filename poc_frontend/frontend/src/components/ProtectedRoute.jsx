import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user} = useAuth();
  // if(loading) return <div>Loading...</div>;
  // console.log(user)
  if(user?.role === "admin") return <Navigate to="/admin"/>
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;