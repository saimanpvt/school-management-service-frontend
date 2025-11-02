import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { studentService, Course } from '../../../../services/student.service';
import { BookOpen, Clock, User, TrendingUp, FileText } from 'lucide-react';
import styles from './student.module.css';

const StudentCourses = () => {
    const router = useRouter();
    const { id } = router.query;
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            studentService.getCourses(id as string)
                .then(data => {
                    setCourses(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching courses:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Student" role="student" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading courses...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Student" role="student" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <h1>My Courses</h1>
                    <p>View all your enrolled courses and progress</p>
                </header>

                <div className={styles.coursesGrid}>
                    {courses.length > 0 ? (
                        courses.map(course => (
                            <div key={course.id} className={styles.courseCard}>
                                <div className={styles.courseHeader}>
                                    <div className={styles.courseIcon}>
                                        <BookOpen size={24} />
                                    </div>
                                    <div className={styles.courseTitleSection}>
                                        <h3>{course.name}</h3>
                                        <div className={styles.courseMeta}>
                                            <span className={styles.teacherInfo}>
                                                <User size={14} />
                                                {course.teacher}
                                            </span>
                                            <span className={styles.scheduleInfo}>
                                                <Clock size={14} />
                                                {course.schedule}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={styles.progressSection}>
                                    <div className={styles.progressHeader}>
                                        <span>Progress</span>
                                        <span className={styles.progressPercent}>{course.progress}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div 
                                            className={styles.progressFill} 
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {course.grade && (
                                    <div className={styles.gradeBadge}>
                                        <TrendingUp size={14} />
                                        Grade: {course.grade}
                                    </div>
                                )}

                                <div className={styles.courseFooter}>
                                    <div className={styles.nextLesson}>
                                        <span>Next Lesson:</span>
                                        <span className={styles.lessonDate}>{course.nextLesson}</span>
                                    </div>
                                    <button 
                                        className={styles.viewCourseBtn}
                                        onClick={() => router.push(`/portal/student/${id}/courses/${course.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>

                                {course.materials && course.materials.length > 0 && (
                                    <div className={styles.materialsPreview}>
                                        <FileText size={14} />
                                        <span>{course.materials.length} materials available</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <BookOpen size={48} />
                            <h3>No courses enrolled</h3>
                            <p>You haven't enrolled in any courses yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentCourses;