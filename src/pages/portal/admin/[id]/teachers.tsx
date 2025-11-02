import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { GraduationCap, Plus, Search, Edit, Trash2 } from 'lucide-react';
import styles from './admin.module.css';

const AdminTeachers = () => {
    const router = useRouter();
    const { id } = router.query;
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (teacherId: string) => {
        if (confirm('Are you sure you want to delete this teacher?')) {
            try {
                await apiServices.teachers.delete(teacherId);
                setTeachers(teachers.filter(t => t.id !== teacherId));
            } catch (error) {
                console.error('Error deleting teacher:', error);
                alert('Failed to delete teacher');
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading teachers...</div>
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
                        <button className={styles.createBtn}>
                            <Plus size={18} />
                            Add Teacher
                        </button>
                    </div>
                </header>

                <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTeachers.length > 0 ? (
                                filteredTeachers.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.name || 'N/A'}</td>
                                        <td>{teacher.email || 'N/A'}</td>
                                        <td>{teacher.department || 'N/A'}</td>
                                        <td>
                                            <span className={styles.statusBadge}>
                                                {teacher.status || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(teacher.id)}
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

