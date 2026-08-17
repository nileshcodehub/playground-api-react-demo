import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LiveApiInspector from '@/components/common/LiveApiInspector';

const PAGE_TITLES = {
  '/': 'Pulse Studio — Showcase App for Playground API',
  '/products': 'E-Commerce Store & Custom Schema | Pulse Studio',
  '/cart': 'Shopping Cart | Pulse Studio',
  '/wishlist': 'Saved Wishlist | Pulse Studio',
  '/posts': 'Social Discussions & Stateful CRUD | Pulse Studio',
  '/users': 'Team Directory & SVG Avatars | Pulse Studio',
  '/todos': 'Task Engine & Live Mutations | Pulse Studio',
  '/media': 'Vector Media Studio | Pulse Studio',
  '/auth': 'JWT Authentication Hub | Pulse Studio',
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'Pulse Studio — Powered by Playground API';
    document.title = title;
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e14] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Body: Sidebar + Content */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sticky Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile Slide-Over Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
              onClick={closeSidebar}
              aria-hidden="true"
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#12151d] z-50 shadow-2xl border-r border-white/10">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Navigation Menu
                </span>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  ✕
                </button>
              </div>
              <Sidebar onCloseMobile={closeSidebar} className="border-r-0 flex-1" />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24">
          <div className="max-w-7xl mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Persistent Live API Inspector Floating Dock */}
      <LiveApiInspector />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;