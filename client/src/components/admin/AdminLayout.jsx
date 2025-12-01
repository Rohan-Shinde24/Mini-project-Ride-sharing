import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Trash2, LogOut, Car, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white';
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white p-4 flex justify-between items-center z-50">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        {/* Mobile Header Spacer - only visible on mobile when sidebar is open to push content down if needed, 
            but here we want the sidebar to cover full height. 
            Actually, the sidebar header is already there in desktop, let's add one for mobile inside sidebar too if we want consistency,
            or just rely on the top padding.
        */}
        <div className="md:hidden p-6 pt-20">
             {/* Extra padding for mobile top bar */}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0">
          <Link
            to="/admin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}
          >
            <Users className="w-5 h-5 mr-3" />
            User Management
          </Link>
          <Link
            to="/admin/recycle-bin"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/recycle-bin')}`}
          >
            <Trash2 className="w-5 h-5 mr-3" />
            Recycle Bin
          </Link>
          <Link
            to="/admin/rides-management"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/rides-management')}`}
          >
            <Car className="w-5 h-5 mr-3" />
            Ride Management
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="flex items-center px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Back to App
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
