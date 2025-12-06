import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';

interface PortalLayoutProps {
    children: React.ReactNode;
    userName: string;
    userRole: "student" | "teacher" | "parent" | "admin";
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children, userName, userRole }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content Area */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <Sidebar role={userRole} />

                {/* Page Content with Avatar */}
                <main className="flex-1 p-8 max-w-screen-xl mx-auto relative">
                    {/* Avatar in top-right corner */}
                    <div className="absolute top-4 right-4 z-10">
                        <ProfileDropdown name={userName} role={userRole} />
                    </div>

                    {children}
                </main>
            </div>
        </div>
    );
};

export default PortalLayout;