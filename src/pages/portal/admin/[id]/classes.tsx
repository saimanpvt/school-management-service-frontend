import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { BookOpen, Plus, Search, Edit, Trash2, X, Users } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

interface ClassFormData {
    className: string;
    classCode: string;
    description: string;
    year: number;
}

interface ClassData {
    _id: string;
    classID: string;
    className: string;
    classCode?: string;
    description?: string;
    year: number;
    createdAt?: string;
    updatedAt?: string;
    courses?: string[];
    students?: string[];
    id?: string;
    __v?: number;
}

const AdminClasses = () => {
    const router = useRouter();
    const { id } = router.query;
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingClassId, setEditingClassId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ClassFormData>({
        className: '',
        classCode: '',
        description: '',
        year: 0,
    });

    useEffect(() => {
        if (id) {
            fetchClasses();
        }
    }, [id]);

    interface ClassesApiResponse {
        success: boolean;
        ongoing?: ClassData[];
        completed?: ClassData[];
        inactive?: ClassData[];
    }

    const fetchClasses = async () => {
        try {
            const response: ClassesApiResponse = await apiServices.classes.getAll();
            console.log('Classes API Response:', response);
            if (response.success) {
                // Handle the API response structure: { success: true, ongoing: [...], completed: [...], inactive: [...] }
                let allClasses: ClassData[] = [];
                const { ongoing = [], completed = [], inactive = [] } = response;
                // Combine all classes from different status arrays
                allClasses = [...ongoing, ...completed, ...inactive];
                setClasses(allClasses);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClasses = classes.filter(
        (cls) =>
            cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (classItem: ClassData) => {
        setFormData({
            className: classItem.className || '',
            classCode: classItem.classCode || '',
            description: classItem.description || '',
            year: classItem.year || 0,
        });
        setIsEditMode(true);
        setEditingClassId(classItem._id);
        setShowAddForm(true);
    };

    const handleDelete = async (classId: string) => {
        if (confirm('Are you sure you want to delete this class?')) {
            try {
                await apiServices.classes.delete(classId);
                setClasses(classes.filter((c) => c._id !== classId));
                alert('Class deleted successfully!');
            } catch (error) {
                console.error('Error deleting class:', error);
                alert('Failed to delete class');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (isEditMode && editingClassId) {
                // Update existing class
                response = await apiServices.classes.update(editingClassId, formData);
                if (response.success) {
                    alert('Class updated successfully!');
                    // Update the classes list with the updated data
                    setClasses(classes.map(cls =>
                        cls._id === editingClassId
                            ? { ...cls, ...formData }
                            : cls
                    ));
                } else {
                    alert('Failed to update class');
                }
            } else {
                // Create new class
                response = await apiServices.classes.create(formData);
                if (response.success) {
                    alert('Class created successfully!');
                    // Refresh classes list
                    fetchClasses();
                } else {
                    alert('Failed to create class');
                }
            }

            if (response.success) {
                setShowAddForm(false);
                // Reset form and edit state
                setFormData({
                    className: '',
                    classCode: '',
                    description: '',
                    year: 0,
                });
                setIsEditMode(false);
                setEditingClassId(null);
            }
        } catch (error) {
            console.error('Error saving class:', error);
            alert('Error saving class');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <PortalLayout userRole="admin" userName="Admin">
                <div className={styles.loading}>
                    <LoadingDots />
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userRole="admin" userName="Admin">
            <header className={styles.pageHeader}>
                <div>
                    <h1>Manage Classes</h1>
                    <p>View and manage class structures</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <button
                        className={styles.createBtn}
                        onClick={() => {
                            setIsEditMode(false);
                            setEditingClassId(null);
                            setFormData({
                                className: '',
                                classCode: '',
                                description: '',
                                year: 0,
                            });
                            setShowAddForm(true);
                        }}
                    >
                        <Plus size={18} />
                        Add Class
                    </button>
                </div>
            </header>

            <div className={styles.statsCards}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <BookOpen size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Classes</h3>
                        <p className={styles.statNumber}>{classes.length}</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Active Classes</h3>
                        <p className={styles.statNumber}>{classes.length}</p>
                    </div>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Class ID</th>
                            <th>Class Name</th>
                            <th>Class Code</th>
                            <th>Year</th>
                            <th>Students</th>
                            <th>Courses</th>

                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((cls) => (
                                <tr key={cls._id}>
                                    <td>{cls.classID}</td>
                                    <td>{cls.className}</td>
                                    <td>
                                        {cls.classCode ? (
                                            <span className={styles.classBadge}>{cls.classCode}</span>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>{cls.year}</td>
                                    <td>
                                        <span className={styles.countBadge}>
                                            {cls.students?.length || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.countBadge}>
                                            {cls.courses?.length || 0}
                                        </span>
                                    </td>

                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => handleEdit(cls)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(cls._id)}
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
                                    <BookOpen size={48} />
                                    <h3>No classes found</h3>
                                    <p>
                                        {searchTerm
                                            ? 'Try a different search term'
                                            : 'No classes in the system'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Class Modal */}
            {showAddForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{isEditMode ? 'Edit Class' : 'Add New Class'}</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => {
                                    setShowAddForm(false);
                                    setIsEditMode(false);
                                    setEditingClassId(null);
                                    setFormData({
                                        className: '',
                                        classCode: '',
                                        description: '',
                                        year: 0,
                                    });
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Class Name *</label>
                                        <input
                                            type="text"
                                            value={formData.className}
                                            onChange={(e) =>
                                                setFormData({ ...formData, className: e.target.value })
                                            }
                                            placeholder="Enter class name (e.g., Grade 10A)"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Class Code *</label>
                                        <input
                                            type="text"
                                            value={formData.classCode}
                                            onChange={(e) =>
                                                setFormData({ ...formData, classCode: e.target.value })
                                            }
                                            placeholder="Enter class code (e.g., G10A)"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Academic Year *</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    year: Number(e.target.value),
                                                })
                                            }
                                            required
                                        >
                                            <option value={0}>Select Academic Year</option>
                                            <option value={2023}>2023</option>
                                            <option value={2024}>2024</option>
                                            <option value={2025}>2025</option>
                                            <option value={2026}>2026</option>
                                            <option value={2027}>2027</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setIsEditMode(false);
                                            setEditingClassId(null);
                                            setFormData({
                                                className: '',
                                                classCode: '',
                                                description: '',
                                                year: 0,
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.createBtn}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? (isEditMode ? 'Updating...' : 'Creating...')
                                            : (isEditMode ? 'Update Class' : 'Create Class')
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
};

export default AdminClasses;
