import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [reloadCounter, setReloadCounter] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // setReloadCounter((prev) => prev + 1); // keep functionality
  };

  // Auto open / close sidebar based on screen size (same as reference)
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen flex overflow-x-hidden relative"
      style={{ "--sidebar-space": sidebarOpen ? "300px" : "50px" }}
    >
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gray-100 transition-all duration-300 z-40
        ${sidebarOpen ? "w-[260px]" : "w-0"} overflow-hidden`}
      >
        <AppSidebar sidebarOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      </div>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div
        // key={reloadCounter}
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: sidebarOpen && window.innerWidth >= 1024 ? 260 : 0,
        }}
      >
        <AppHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={toggleSidebar}
        />

        <main className="p-2 sm:p-4 md:p-6">
          <div className="mx-auto max-w-screen-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
