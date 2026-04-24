import React from "react";
import AdminNavbar from "../pages/admin/AdminNavbar";
import { Outlet } from "react-router-dom";


const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-6"><Outlet/></div>
    </div>
  );
};

export default AdminLayout;