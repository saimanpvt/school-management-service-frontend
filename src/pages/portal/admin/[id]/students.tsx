import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { Users, Plus, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import styles from './admin.module.css';

const AdminStudents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                        <button className={styles.createBtn}>
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

