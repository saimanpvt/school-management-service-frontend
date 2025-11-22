import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import UserForm, { UserFormData } from '../../../../components/UserForm';
import styles from './admin.module.css';

const AdminParents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [parents, setParents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        role: '4', // Parent
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
        { value: '4', label: 'Parent', color: '#f59e0b' }
    ];
    const genderOptions = ['Male', 'Female', 'Other'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        if (id) {
            apiServices.admin.getAllUsers()
                .then(response => {
                    if (response.success) {
                        const parents = (response.data || []).filter((u: any) => u.role === 4);
                        setParents(parents);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching parents:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const filteredParents = parents.filter(parent =>
    (parent.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.userID?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (parentId: string) => {
        if (confirm('Are you sure you want to delete this parent?')) {
            try {
                await apiServices.admin.deleteUser(parentId);
                setParents(parents.filter(p => p._id !== parentId));
            } catch (error) {
                console.error('Error deleting parent:', error);
                alert('Failed to delete parent');
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
                role: 4 // Parent
            };
            const response = await apiServices.admin.createUser(userData);
            if (response.success) {
                await apiServices.admin.sendCredentialsEmail({
                    email: formData.email,
                    password: generatedPassword,
                    userID: formData.userID,
                    firstName: formData.firstName
                });
                alert('Parent created successfully and credentials sent via email!');
                setParents([...parents, response.data]);
                setShowAddForm(false);
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    role: '4',
                    phone: '',
                    userID: '',
                    address: { street: '', city: '', state: '', zipCode: '', country: '' },
                    dob: '',
                    gender: '',
                    bloodGroup: ''
                });
                setGeneratedPassword('');
                setShowPassword(false);
            }
        } catch (error) {
            console.error('Error creating parent:', error);
            alert('Failed to create parent');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading parents...</div>
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
                    />
                )}
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Manage Parents</h1>
                        <p>View and manage all parents in the system</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search parents..."
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
                            Add Parent
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParents.length > 0 ? (
                                filteredParents.map(parent => (
                                    <tr key={parent._id}>
                                        <td>{parent.userID || 'N/A'}</td>
                                        <td>{parent.firstName} {parent.lastName}</td>
                                        <td>{parent.email || 'N/A'}</td>
                                        <td>{parent.isActive ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(parent._id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className={styles.emptyState}>
                                        <Users size={48} />
                                        <h3>No parents found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : 'No parents in the system'}</p>
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

export default AdminParents;
