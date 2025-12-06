import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { studentService } from '../../../../services/student.service';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface GradeData {
    courseId: string;
    courseName: string;
    assignments: { id: string; title: string; grade: number; maxGrade: number }[];
    tests: { id: string; title: string; grade: number; maxGrade: number }[];
    finalGrade?: number;
}

const StudentGrades = () => {
    const router = useRouter();
    const { id } = router.query;
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            studentService.getGrades(id as string)
                .then(data => {
                    setGrades(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching grades:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const calculateAverage = (items: { grade: number; maxGrade: number }[]) => {
        if (items.length === 0) return 0;
        const total = items.reduce((sum, item) => sum + (item.grade / item.maxGrade) * 100, 0);
        return total / items.length;
    };

    if (loading) {
        return (
            <PortalLayout userName="Student" userRole="student">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Student" userRole="student">
            <header className={styles.pageHeader}>
                <h1>My Grades</h1>
                <p>View your academic performance across all courses</p>
            </header>

            <div className={styles.gradesContainer}>
                {grades.length > 0 ? (
                    grades.map(course => (
                        <div key={course.courseId} className={styles.gradeCard}>
                            <div className={styles.courseName}>{course.courseName}</div>

                            {course.assignments.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.75rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Assignments</h4>
                                    <table className={styles.gradeTable}>
                                        <thead>
                                            <tr>
                                                <th>Assignment</th>
                                                <th>Grade</th>
                                                <th>Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {course.assignments.map(assignment => (
                                                <tr key={assignment.id}>
                                                    <td>{assignment.title}</td>
                                                    <td className={styles.gradeValue}>
                                                        {assignment.grade} / {assignment.maxGrade}
                                                    </td>
                                                    <td>
                                                        {((assignment.grade / assignment.maxGrade) * 100).toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {course.tests.length > 0 && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ marginBottom: '0.75rem', color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Tests</h4>
                                    <table className={styles.gradeTable}>
                                        <thead>
                                            <tr>
                                                <th>Test</th>
                                                <th>Grade</th>
                                                <th>Percentage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {course.tests.map(test => (
                                                <tr key={test.id}>
                                                    <td>{test.title}</td>
                                                    <td className={styles.gradeValue}>
                                                        {test.grade} / {test.maxGrade}
                                                    </td>
                                                    <td>
                                                        {((test.grade / test.maxGrade) * 100).toFixed(1)}%
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {(course.assignments.length > 0 || course.tests.length > 0) && (
                                <div className={styles.finalGrade}>
                                    <span className={styles.finalGradeLabel}>
                                        <Award size={18} style={{ marginRight: '0.5rem' }} />
                                        Course Average
                                    </span>
                                    <span className={styles.finalGradeValue}>
                                        {course.finalGrade !== undefined
                                            ? `${course.finalGrade.toFixed(1)}%`
                                            : `${calculateAverage([...course.assignments, ...course.tests]).toFixed(1)}%`
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <BarChart2 size={48} />
                        <h3>No grades available</h3>
                        <p>Your grades will appear here once they are published.</p>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default StudentGrades;