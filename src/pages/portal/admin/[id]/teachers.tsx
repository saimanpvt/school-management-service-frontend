
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { withAuth } from '../../../../lib/withAuth';
import { apiServices } from '../../../../lib/api';
import { GraduationCap, Plus, Search, Edit, Trash2 } from 'lucide-react';
import UserForm, { UserFormData } from '../../../../components/UserForm';
import styles from './admin.module.css';


const AdminTeachers = () => {
    const router = useRouter();
    const { id } = router.query;
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        role: '2', // Teacher
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
        bloodGroup: '',
        subject: '',
        qualification: '',
        experience: ''
    });
    const roleOptions = [
        { value: '2', label: 'Teacher', color: '#3b82f6' }
    ];
    const genderOptions = ['Male', 'Female', 'Other'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        if (id) {
            apiServices.teachers.getAll()
                .then(response => {
                    if (response.success) {
                        setTeachers(response.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching teachers:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const filteredTeachers = teachers.filter(teacher =>
    (teacher.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.userID?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (teacherId: string) => {
        if (confirm('Are you sure you want to delete this teacher?')) {
            try {
                await apiServices.teachers.delete(teacherId);
                setTeachers(teachers.filter(t => t._id !== teacherId));
            } catch (error) {
                console.error('Error deleting teacher:', error);
                alert('Failed to delete teacher');
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
                role: 2 // Teacher
            };
            const response = await apiServices.teachers.create(userData);
            if (response.success) {
                // Optionally send credentials email if needed (implement if required)
                alert('Teacher created successfully!');
                setTeachers([...teachers, response.data]);
                setShowAddForm(false);
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    role: '2',
                    phone: '',
                    userID: '',
                    address: { street: '', city: '', state: '', zipCode: '', country: '' },
                    dob: '',
                    gender: '',
                    bloodGroup: '',
                    subject: '',
                    qualification: '',
                    experience: ''
                });
                setGeneratedPassword('');
                setShowPassword(false);
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
            alert('Failed to create teacher');
        }
    };


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
                        <h1>Manage Teachers</h1>
                        <p>View and manage all teachers in the system</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search teachers..."
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
                            Add Teacher
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
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map(teacher => (
                                    <tr key={teacher._id}>
                                        <td>{teacher.userID || 'N/A'}</td>
                                        <td>{teacher.firstName} {teacher.lastName}</td>
                                        <td>{teacher.email || 'N/A'}</td>
                                        <td>{teacher.subject || 'N/A'}</td>
                                        <td>{teacher.isActive ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(teacher._id)}
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
                                        <GraduationCap size={48} />
                                        <h3>No teachers found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : 'No teachers in the system'}</p>
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

export default AdminTeachers;

