import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/authorize";

const ProtectedRoute = () => {
  const { user } = useAuth();
  // if(loading) return <div>Loading...</div>;
  // console.log(user?.roles[0])
  // if(user?.roles[0].name === "admin") return <Navigate to="/admin"/>

  return user ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;
