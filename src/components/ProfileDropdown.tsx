import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User, LogOut, Settings, Lock } from 'lucide-react';
import { useAuth } from '../lib/auth';

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
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
            case 'admin': return 'bg-red-100 text-red-800';
            case 'teacher': return 'bg-blue-100 text-blue-800';
            case 'student': return 'bg-green-100 text-green-800';
            case 'parent': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button - Just Avatar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {name ? name.charAt(0).toUpperCase() : 'U'}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* Profile Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {name ? name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{name || 'User'}</p>
                                <p className={`text-xs px-2 py-1 rounded-full inline-flex capitalize mt-1 ${getRoleColor(role)}`}>
                                    {role || 'User'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/settings');
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Settings size={16} />
                            <span>Settings</span>
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/change-password');
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Lock size={16} />
                            <span>Change Password</span>
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
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