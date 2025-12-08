import React from 'react';
import ProfileDropdown from './ProfileDropdown';

interface PortalHeaderProps {
  userName: string;
  userRole: string;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ userName, userRole }) => {
  return (
    <header className="absolute top-0 right-0 z-10 p-4">
      <ProfileDropdown name={userName} role={userRole} />
    </header>
  );
};

export default PortalHeader;
