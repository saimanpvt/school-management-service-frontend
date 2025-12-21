import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import styles from './PortalLayout.module.css';
import Sidebar from '../Sidebar/Sidebar';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';

interface PortalLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: 'student' | 'teacher' | 'parent' | 'admin';
}

const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  userName,
  userRole,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button
          onClick={toggleSidebar}
          className={styles.menuButton}
          aria-label="Open menu"
        >
          <Menu size={24} className={styles.menuIcon} />
        </button>

        <div className={styles.headerRight}>
          <span className={styles.portalTitle}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal
          </span>
          <ProfileDropdown name={userName} role={userRole} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar role={userRole} isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Page Content with Avatar */}
        <main className={styles.content}>
          {/* Desktop Avatar in top-right corner */}
          <div className={styles.desktopAvatar}>
            <ProfileDropdown name={userName} role={userRole} />
          </div>

          {/* Add top margin on mobile to account for fixed header */}
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
