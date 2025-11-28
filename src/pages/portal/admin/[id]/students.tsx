
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { withAuth } from '../../../../lib/withAuth';
import { apiServices } from '../../../../lib/api';
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react';
import UserForm, { UserFormData } from '../../../../components/UserForm';
import styles from './admin.module.css';


const AdminStudents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        email: '',
        firstName: '',
        lastName: '',
        role: '3', // Student
        phone: '',
        userId: '',
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
        parentId: '',
        studentId: '',
        classId: '',
        admissionDate: '',
        leavingDate: '',
        emergencyContact: ''
    });
    const roleOptions = [
        { value: '3', label: 'Student', color: '#10b981' }
    ];
    const genderOptions = ['Male', 'Female', 'Other'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    // parentOptions removed (no longer needed)

    useEffect(() => {
        if (id) {
            apiServices.students.getAll()
                .then(response => {
                    if (response.success) {
                        setStudents(response.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching students:', error);
                    setLoading(false);
                });
            // Removed parent fetch for dropdown (now text input)
        }
        console.log("students", students);
    }, [id]);


    const filteredStudents = students.filter(student =>
    (student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userID?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (studentId: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                await apiServices.students.delete(studentId);
                setStudents(students.filter(s => s._id !== studentId));
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!generatedPassword) {
            alert('Please generate a password first');
            return;
        }
        // Validate required student fields
        const missingFields = [];
        if (!formData.userId) missingFields.push('User ID');
        if (!formData.parentId) missingFields.push('Parent');
        if (!formData.classTeacher) missingFields.push('Class Teacher');
        if (!formData.course) missingFields.push('Course');
        if (!formData.dob) missingFields.push('Date of Birth');
        if (!formData.classId) missingFields.push('Class ID');
        if (!formData.studentId) missingFields.push('Student ID');
        if (missingFields.length > 0) {
            alert('Please fill all required fields: ' + missingFields.join(', '));
            return;
        }
        try {
            // Prepare student data for backend with correct field names
            const studentData = {
                user: formData.userId, // Backend expects 'user' or 'userID'
                parent: formData.parentId, // Backend expects 'parent'
                classTeacher: formData.classTeacher,
                course: formData.course,
                dateOfBirth: formData.dob, // Backend expects 'dateOfBirth'
                classId: formData.classId,
                studentId: formData.studentId,
                admissionDate: formData.admissionDate,
                leavingDate: formData.leavingDate,
                emergencyContact: formData.emergencyContact,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                gender: formData.gender,
                bloodGroup: formData.bloodGroup,
                address: formData.address,
                password: generatedPassword,
                role: 3 // Student
            };
            const response = await apiServices.students.create(studentData);
            if (response.success) {
                alert('Student created successfully!');
                setStudents([...students, response.data]);
                setShowAddForm(false);
                setFormData({
                    email: '',
                    firstName: '',
                    lastName: '',
                    role: '3',
                    phone: '',
                    userId: '',
                    address: { street: '', city: '', state: '', zipCode: '', country: '' },
                    dob: '',
                    gender: '',
                    bloodGroup: '',
                    parentId: '',
                    studentId: '',
                    classId: '',
                    admissionDate: '',
                    leavingDate: '',
                    emergencyContact: '',
                    classTeacher: '',
                    course: ''
                });
                setGeneratedPassword('');
                setShowPassword(false);
            }
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Failed to create student');
        }
    };


    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading students...</div>
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
                        <h1>Manage Students</h1>
                        <p>View and manage all students in the system</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search students..."
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
                            Add Student
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
                                <th>Parent</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student._id}>
                                        <td>{student.userId || student.userID || 'N/A'}</td>
                                        <td>{student.firstName || ''} {student.lastName || ''}</td>
                                        <td>{student.email || 'N/A'}</td>
                                        <td>{student.parentId || student.parentName || 'N/A'}</td>
                                        <td>{student.isActive === false ? 'Inactive' : 'Active'}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(student._id)}
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
                                        <h3>No students found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : 'No students in the system'}</p>
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

export default AdminStudents;

