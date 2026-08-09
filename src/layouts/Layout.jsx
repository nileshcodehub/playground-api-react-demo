import { useState } from 'react';
import { Outlet } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {/* Main Body Area: Sidebar + Main Content Container */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sticky Sidebar */}
        <Sidebar className="hidden lg:flex" />
        {/* Mobile Slide-Over Sidebar Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            {/* Drawer Content */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#111827] z-50 shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-[#1f2937]">
                <span className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                  Navigation
                </span>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f2937] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <Sidebar onCloseMobile={closeSidebar} className="border-r-0 flex-1" />
            </div>
          </div>
        )}
        {/* Main Content Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
export default Layout;