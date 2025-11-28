import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { Users, Plus, Search, Edit, Trash2, UserCheck, UserX, GraduationCap, BookOpen, Heart } from 'lucide-react';
import UserForm, { UserFormData } from '../../../../components/UserForm';
import { withAuth } from '../../../../lib/withAuth';
import styles from './admin.module.css';

type UserType = 'student' | 'teacher' | 'parent' | 'admin';

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    userID: string;
    role: number;
    phone?: string;
    address?: any;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    isActive: boolean;
}

const UserManagement = () => {
    const router = useRouter();
    const { id } = router.query;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeUserType, setActiveUserType] = useState<UserType>('student');
    const [showAddForm, setShowAddForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        role: '1', // Default to Admin
        phone: '',
        userID: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        dob: '',
        gender: '',
        bloodGroup: ''
    });

    // Role mappings
    const roleMap = {
        1: 'Admin',
        2: 'Teacher',
        3: 'Student',
        4: 'Parent'
    };

    const userTypeFilters = [
        { key: 'student' as UserType, label: 'Students', icon: GraduationCap, color: '#2563eb' },
        { key: 'teacher' as UserType, label: 'Teachers', icon: BookOpen, color: '#059669' },
        { key: 'parent' as UserType, label: 'Parents', icon: Heart, color: '#f59e0b' },
        { key: 'admin' as UserType, label: 'Admins', icon: UserCheck, color: '#dc2626' }
    ];

    const roleOptions = [
        { value: '1', label: 'Admin', color: '#dc2626' },
        { value: '2', label: 'Teacher', color: '#059669' },
        { value: '3', label: 'Student', color: '#2563eb' },
        { value: '4', label: 'Parent', color: '#f59e0b' }
    ];

    const genderOptions = ['Male', 'Female', 'Other'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        if (id) {
            fetchUsers();
        }
    }, [id]);

    const fetchUsers = async () => {
        try {
            const response = await apiServices.admin.getAllUsers();
            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        // Filter by user type
        const roleMapping = {
            'admin': 1,
            'teacher': 2,
            'student': 3,
            'parent': 4
        };
        const typeMatch = user.role === roleMapping[activeUserType];

        // Filter by search term
        const searchMatch =
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userID?.toLowerCase().includes(searchTerm.toLowerCase());

        return typeMatch && searchMatch;
    });

    const handleDelete = async (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await apiServices.admin.deleteUser(userId);
                setUsers(users.filter(u => u._id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!generatedPassword) {
            alert('Please generate a password first');
            return;
        }
        try {
            const userData = {
                ...formData,
                password: generatedPassword,
                role: parseInt(formData.role)
            };
            const response = await apiServices.admin.createUser(userData);
            if (response.success) {
                await apiServices.admin.sendCredentialsEmail({
                    email: formData.email,
                    password: generatedPassword,
                    userID: formData.userID,
                    firstName: formData.firstName
                });
                alert('User created successfully and credentials sent via email!');
                setUsers([...users, response.data]);
                setShowAddForm(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            role: '1',
            phone: '',
            userID: '',
            address: { street: '', city: '', state: '', zipCode: '', country: '' },
            dob: '',
            gender: '',
            bloodGroup: ''
        });
        setGeneratedPassword('');
        setShowPassword(false);
    };

    const getRoleColor = (role: number) => {
        const colors = {
            1: '#dc2626', // Admin - Red
            2: '#059669', // Teacher - Green
            3: '#2563eb', // Student - Blue
            4: '#f59e0b'  // Parent - Yellow
        };
        return colors[role] || '#6b7280';
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading users...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Admin" role="admin" />
            <main className={styles.main}>
                {showAddForm && (
                    <UserForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onClose={() => setShowAddForm(false)}
                        generatedPassword={generatedPassword}
                        setGeneratedPassword={setGeneratedPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        roleOptions={roleOptions}
                        genderOptions={genderOptions}
                        bloodGroupOptions={bloodGroupOptions}
                        fixedRole={formData.role}
                    />
                )}

                <header className={styles.pageHeader}>
                    <div>
                        <h1>User Management</h1>
                        <p>Manage all users in the system - admins, teachers, students, and parents</p>
                    </div>
                </header>

                {/* User Type Filter Tabs - At the top */}
                <div className={styles.filterTabs}>
                    {userTypeFilters.map(filter => {
                        const Icon = filter.icon;
                        const isActive = activeUserType === filter.key;
                        const count = users.filter(u => u.role === (filter.key === 'admin' ? 1 : filter.key === 'teacher' ? 2 : filter.key === 'student' ? 3 : 4)).length;

                        return (
                            <button
                                key={filter.key}
                                className={`${styles.filterTab} ${isActive ? styles.active : ''}`}
                                onClick={() => setActiveUserType(filter.key)}
                                style={{
                                    borderColor: isActive ? filter.color : '#e5e7eb',
                                    color: isActive ? filter.color : '#6b7280'
                                }}
                            >
                                <Icon size={18} />
                                <span>{filter.label}</span>
                                <span className={styles.count}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Action bar below tabs */}
                <div className={styles.actionBar}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={`Search ${activeUserType === 'all' ? 'users' : activeUserType + 's'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.addButtons}>
                        <button
                            className={`${styles.createBtn} ${styles[activeUserType]}`}
                            onClick={() => {
                                // Set the role based on active tab
                                const roleMap = { student: '3', teacher: '2', parent: '4', admin: '1' };
                                setFormData(prev => ({ ...prev, role: roleMap[activeUserType] }));
                                setShowAddForm(true);
                            }}
                        >
                            <Plus size={18} />
                            Add {activeUserType.charAt(0).toUpperCase() + activeUserType.slice(1)}
                        </button>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.userID || 'N/A'}</td>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td>
                                            <span
                                                className={styles.roleBadge}
                                                style={{
                                                    backgroundColor: getRoleColor(user.role) + '20',
                                                    color: getRoleColor(user.role),
                                                    border: `1px solid ${getRoleColor(user.role)}30`
                                                }}
                                            >
                                                {roleMap[user.role as keyof typeof roleMap] || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyState}>
                                        <Users size={48} />
                                        <h3>No users found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : `No ${activeUserType}s in the system`}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default withAuth(UserManagement, ['Admin']);