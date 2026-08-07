import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Navigate } from 'react-router-dom';

const Layout = ({ children, title, role, reportCount }) => {
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem('user');
  }

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-theme-bg flex">
      <Sidebar role={role} reportCount={reportCount} />
      <div className="flex-1 flex flex-col overflow-hidden max-w-[1600px] mx-auto w-full">
        <Navbar title={title} user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
