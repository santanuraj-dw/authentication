import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RolesPage from "./pages/admin/Roles";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionRoute from "./components/PermissionRoute";
import RoleRoute from "./components/AdminRoute";

import AdminLayout from "./layouts/AdminLayout";

import { PERMISSIONS } from "./constants/permissions";
import AdminRoute from "./components/AdminRoute";
import ProjectManagerDashboard from "./pages/project_manager/ProjectManagerDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/verify-email" element={<EmailVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/*  PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Permission-based route */}
              <Route
                path="/roles"
                element={
                  <PermissionRoute permissions={[PERMISSIONS.ROLE_READ]}>
                    <RolesPage />
                  </PermissionRoute>
                }
              />
            </Route>
          </Route>
          {/* PROJECT MANAGER ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/pm-dashboard"
              element={
                <PermissionRoute permissions={[PERMISSIONS.PROJECT_READ]}>
                  <ProjectManagerDashboard />
                </PermissionRoute>
              }
            />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
