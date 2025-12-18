import { useState } from "react";

import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import VideoFeed from "../components/VideoFeed.jsx";

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  function handleMenuClick() {
    setSidebarOpen(!sidebarOpen);
  }

  function handleOverlayClick() {
    setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar onMenuClick={handleMenuClick} />

      <div className="flex pt-16 overflow-x-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1 lg:ml-64 ">
          <VideoFeed />   
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
    </div>
  );
}

export default Index;
