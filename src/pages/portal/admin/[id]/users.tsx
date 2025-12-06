import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { ProtectedRoute } from '../../../../lib/auth';
import { apiServices } from '../../../../services/api';
import { Users, Plus, Search, Edit, Trash2, X, Mail, Eye, EyeOff } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    userID: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    dob: string;
    gender: string;
    bloodGroup: string;
}

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: number;
    roleName: string;
    userID: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

const AdminUsers = () => {
    const router = useRouter();
    const { id } = router.query;
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        role: '',
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

    const roleOptions = [
        { value: 'admin', label: 'Admin', color: '#ef4444' },
        { value: 'teacher', label: 'Teacher', color: '#3b82f6' },
        { value: 'student', label: 'Student', color: '#10b981' },
        { value: 'parent', label: 'Parent', color: '#f59e0b' }
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

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setGeneratedPassword(password);
        return password;
    };

    const generateUserID = (role: string, firstName: string, lastName: string) => {
        const rolePrefix = {
            '1': 'ADM',
            '2': 'TCH',
            '3': 'STD',
            '4': 'PAR'
        };

        const prefix = rolePrefix[role as keyof typeof rolePrefix] || 'USR';
        const timestamp = Date.now().toString().slice(-4);
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

        return `${prefix}${initials}${timestamp}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Auto-generate userID when role, firstName, or lastName changes
        if (name === 'role' || name === 'firstName' || name === 'lastName') {
            const currentRole = name === 'role' ? value : formData.role;
            const currentFirstName = name === 'firstName' ? value : formData.firstName;
            const currentLastName = name === 'lastName' ? value : formData.lastName;

            if (currentRole && currentFirstName && currentLastName) {
                const newUserID = generateUserID(currentRole, currentFirstName, currentLastName);
                setFormData(prev => ({ ...prev, userID: newUserID }));
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
                role: formData.role
            };

            const response = await apiServices.users.create(userData);

            if (response.success) {
                // Send email with credentials
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
            role: '',
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
        setGeneratedPassword('');
        setShowPassword(false);
    };

    const handleDelete = async (userID: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await apiServices.users.delete(userID);
                setUsers(users.filter(u => u._id !== userID));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: number) => {
        const colors = {
            1: '#ef4444', // Admin - Red
            2: '#3b82f6', // Teacher - Blue
            3: '#10b981', // Student - Green
            4: '#f59e0b'  // Parent - Yellow
        };
        return colors[role as keyof typeof colors] || '#6b7280';
    };

    const renderAddUserForm = () => (
        <div className={styles.formOverlay}>
            <div className={`${styles.formContainer} ${styles.largeForm}`}>
                <div className={styles.formHeader}>
                    <h2>Add New User</h2>
                    <button
                        className={styles.closeButton}
                        onClick={() => {
                            setShowAddForm(false);
                            resetForm();
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Role *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Role</option>
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>User ID</label>
                            <input
                                type="text"
                                name="userID"
                                value={formData.userID}
                                onChange={handleInputChange}
                                placeholder="Auto-generated"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map(gender => (
                                    <option key={gender} value={gender}>
                                        {gender}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={formData.bloodGroup}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Blood Group</option>
                                {bloodGroupOptions.map(bg => (
                                    <option key={bg} value={bg}>
                                        {bg}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.addressSection}>
                        <h3>Address Information</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Street</label>
                                <input
                                    type="text"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>State</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    value={formData.address.zipCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Country</label>
                            <input
                                type="text"
                                name="address.country"
                                value={formData.address.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles.passwordSection}>
                        <h3>Password Generation</h3>
                        <div className={styles.passwordGenerator}>
                            <div className={styles.passwordField}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={generatedPassword}
                                    placeholder="Click generate to create password"
                                    readOnly
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <button
                                type="button"
                                className={styles.generatePasswordBtn}
                                onClick={generatePassword}
                            >
                                Generate Password
                            </button>
                        </div>
                        <p className={styles.passwordNote}>
                            <Mail size={16} />
                            Password will be sent to user's email automatically
                        </p>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={!generatedPassword}
                    >
                        Create User & Send Credentials
                    </button>
                </form>
            </div>
        </div>
    );

    if (loading) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
            {showAddForm && renderAddUserForm()}

            <header className={styles.pageHeader}>
                <div>
                    <h1>User Management</h1>
                    <p>Manage all users in the system - Students, Teachers, Parents, and Admins</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button
                        className={styles.createBtn}
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <span className={styles.userID}>{user.userID}</span>
                                    </td>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userAvatar}>
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </div>
                                            <span>{user.fullName}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={styles.roleBadge}
                                            style={{ backgroundColor: getRoleColor(user.role) }}
                                        >
                                            {user.roleName}
                                        </span>
                                    </td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>
                                        <span
                                            className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive
                                                }`}
                                        >
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        {user.lastLogin
                                            ? new Date(user.lastLogin).toLocaleDateString()
                                            : 'Never'
                                        }
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
                                <td colSpan={8} className={styles.emptyState}>
                                    <Users size={48} />
                                    <h3>No users found</h3>
                                    <p>{searchTerm ? 'Try a different search term' : 'No users in the system'}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PortalLayout>
    );
};

export default AdminUsers;