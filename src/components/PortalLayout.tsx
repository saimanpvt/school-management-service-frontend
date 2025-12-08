import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';

interface PortalLayoutProps {
    children: React.ReactNode;
    userName: string;
    userRole: "student" | "teacher" | "parent" | "admin";
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children, userName, userRole }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} className="text-gray-600" />
                </button>

                <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-800 mr-4">
                        {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
                    </span>
                    <ProfileDropdown name={userName} role={userRole} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar
                    role={userRole}
                    isOpen={sidebarOpen}
                    onClose={closeSidebar}
                />

                {/* Page Content with Avatar */}
                <main className="flex-1 md:ml-60 p-4 md:p-8 relative">
                    {/* Desktop Avatar in top-right corner */}
                    <div className="hidden md:block absolute top-4 right-4 z-10">
                        <ProfileDropdown name={userName} role={userRole} />
                    </div>

                    {/* Add top margin on mobile to account for fixed header */}
                    <div className="md:mt-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PortalLayout;