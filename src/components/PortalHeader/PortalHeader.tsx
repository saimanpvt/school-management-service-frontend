import React from 'react';
import ProfileDropdown from '../ProfileDropdown';
import styles from './PortalHeader.module.css';

interface PortalHeaderProps {
  userName: string;
  userRole: string;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ userName, userRole }) => {
  return (
    <header className={styles.header}>
      <ProfileDropdown name={userName} role={userRole} />
    </header>
  );
};

export default PortalHeader;
