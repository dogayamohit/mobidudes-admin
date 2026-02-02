import { useState } from "react";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reloadCounter, setReloadCounter] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setReloadCounter(prev => prev + 1); // force main content reload
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-100 text-white transition-all duration-300 ${
          sidebarOpen ? "w-[260px]" : "w-0"
        } overflow-hidden`}
      >
        <AppSidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <MainContent
        key={reloadCounter} // changes when sidebar toggles
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
}

// Wrapper component for the full main content
function MainContent({ sidebarOpen, toggleSidebar }) {
  return (
    <div
      className={`flex-1 transition-all duration-300 ml-0`}
      style={{ marginLeft: sidebarOpen ? 260 : 0 }}
    >
      <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={toggleSidebar} />

      {/* Page Content */}
      <main className="flex-1 p-2 md:p-4">
        <div className="mx-auto max-w-screen-2xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
