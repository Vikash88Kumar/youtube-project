import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Switch } from "../components/ui/switch";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16">
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <SettingsIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            
            <div className="space-y-6">
              {/* Account */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Account</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>user@example.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Username</span>
                    <span>@username</span>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Message Alerts</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Privacy</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Private Account</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Online Status</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Appearance</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Dark Mode</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Compact Mode</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Settings;