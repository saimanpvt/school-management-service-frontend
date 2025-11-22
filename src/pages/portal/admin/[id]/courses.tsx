import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { BookOpen, Plus, Search, Edit, Trash2 } from 'lucide-react';
import CourseForm from '../../../../components/CourseForm';
import { CourseFormData } from '../../../../types/course';
import styles from './admin.module.css';

const AdminCourses = () => {
    const router = useRouter();
    const { id } = router.query;
    const [courses, setCourses] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<CourseFormData>({
        courseCode: '',
        courseName: '',
        description: '',
        duration: 1,
        teacherId: '',
        classId: '',
        academicYear: '2024-2025',
        isActive: true
    });

    useEffect(() => {
        if (id) {
            // Fetch courses, teachers, and classes
            Promise.all([
                apiServices.courses.getAll(),
                apiServices.teachers.getAll(),
                apiServices.classes.getAll()
            ])
                .then(([coursesRes, teachersRes, classesRes]) => {
                    if (coursesRes.success) {
                        setCourses(coursesRes.data || []);
                    }
                    if (teachersRes.success) {
                        setTeachers(teachersRes.data || []);
                    }
                    if (classesRes.success) {
                        setClasses(classesRes.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const filteredCourses = courses.filter(course =>
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiServices.courses.create(formData);
            if (response.success) {
                setCourses([...courses, response.data]);
                setFormData({
                    courseCode: '',
                    courseName: '',
                    description: '',
                    duration: 1,
                    teacherId: '',
                    classId: '',
                    academicYear: '2024-2025',
                    isActive: true
                });
                setShowAddForm(false);
                alert('Course created successfully!');
            } else {
                alert('Failed to create course: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course');
        }
    };

    const handleDelete = async (courseId: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await apiServices.courses.delete(courseId);
                setCourses(courses.filter(c => c._id !== courseId));
            } catch (error) {
                console.error('Error deleting course:', error);
                alert('Failed to delete course');
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading courses...</div>
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
                        <h1>Manage Courses</h1>
                        <p>View and manage all courses in the system</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search courses..."
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
                            Add Course
                        </button>
                    </div>
                </header>

                {showAddForm && (
                    <CourseForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onClose={() => setShowAddForm(false)}
                        teacherOptions={teachers.map((t: any) => ({ value: t._id, label: `${t.firstName} ${t.lastName}${t.subject ? ' - ' + t.subject : ''}` }))}
                        classOptions={classes.map((c: any) => ({ value: c._id, label: c.className }))}
                    />
                )}

                <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Code</th>
                                <th>Instructor</th>
                                <th>Credits</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.name || 'N/A'}</td>
                                        <td>{course.code || 'N/A'}</td>
                                        <td>{course.instructor || 'N/A'}</td>
                                        <td>{course.credits || 'N/A'}</td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(course.id)}
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
                                        <BookOpen size={48} />
                                        <h3>No courses found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : 'No courses in the system'}</p>
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

export default AdminCourses;

