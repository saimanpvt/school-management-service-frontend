import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LogOut, Settings, Lock } from 'lucide-react';

import styles from './ProfileDropdown.module.css';
import { useAuth } from '../../lib/auth';

interface ProfileDropdownProps {
  name: string;
  role: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ name, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return styles.roleAdmin;
      case 'teacher':
        return styles.roleTeacher;
      case 'student':
        return styles.roleStudent;
      case 'parent':
        return styles.roleParent;
      default:
        return styles.roleDefault;
    }
  };

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      {/* Profile Button - Just Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.profileButton}
      >
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className={styles.profileDetails}>
                <p className={styles.userName}>{name || 'User'}</p>
                <p className={`${styles.userRole} ${getRoleColor(role)}`}>
                  {role || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className={styles.menuItems}>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/portal/settings');
              }}
              className={styles.menuItem}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/portal/change-password');
              }}
              className={styles.menuItem}
            >
              <Lock size={16} />
              <span>Change Password</span>
            </button>

            <div className={styles.menuDivider}></div>

            <button onClick={handleLogout} className={styles.logoutItem}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
