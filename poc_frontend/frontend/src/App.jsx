import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./app.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute";
import VerifyOtp from "./pages/VerifyOtp";
import EmailVerify from "./pages/EmailVerify";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RolesPage from "./pages/admin/Roles";
import PermissionRoute from "./components/PermissionRoute";
import { PERMISSIONS } from "./constants/permissions";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-email" element={<EmailVerify />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/verify-reset-otp" element={<VerifyResetOtp />} /> */}
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PermissionRoute permissions={[PERMISSIONS.ROLE_READ]}>
              {/* <AdminRoute> */}
                <RolesPage />
              {/* </AdminRoute> */}
              </PermissionRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
