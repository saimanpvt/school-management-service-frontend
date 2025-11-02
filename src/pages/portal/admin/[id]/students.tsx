import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { Users, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import styles from './admin.module.css';

interface StudentFormData {
    name: string;
    email: string;
    password: string;
    rollNumber: string;
    class: string;
    section: string;
    parentEmail: string;
}

const AdminStudents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<StudentFormData>({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        class: '',
        section: '',
        parentEmail: ''
    });

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
        }
    }, [id]);

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (studentId: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                await apiServices.students.delete(studentId);
                setStudents(students.filter(s => s.id !== studentId));
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiServices.students.create(formData);
            if (response.success) {
                setStudents([...students, response.data]);
                setShowAddForm(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    rollNumber: '',
                    class: '',
                    section: '',
                    parentEmail: ''
                });
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student');
        }
    };

    const renderAddStudentForm = () => (
        <div className={styles.formOverlay}>
            <div className={styles.formContainer}>
                <div className={styles.formHeader}>
                    <h2>Add New Student</h2>
                    <button
                        className={styles.closeButton}
                        onClick={() => setShowAddForm(false)}
                    >
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Student Name"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Student Email"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleInputChange}
                            placeholder="Roll Number"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="class"
                            value={formData.class}
                            onChange={handleInputChange}
                            placeholder="Class"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleInputChange}
                            placeholder="Section"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            name="parentEmail"
                            value={formData.parentEmail}
                            onChange={handleInputChange}
                            placeholder="Parent Email"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Add Student
                    </button>
                </form>
            </div>
        </div>
    );

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
                {showAddForm && renderAddStudentForm()}
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roll Number</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.name || 'N/A'}</td>
                                        <td>{student.email || 'N/A'}</td>
                                        <td>{student.rollNumber || 'N/A'}</td>
                                        <td>{student.grade || 'N/A'}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(student.id)}
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

