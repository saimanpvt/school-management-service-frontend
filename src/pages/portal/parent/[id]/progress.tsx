import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface ProgressData {
    childId: string;
    childName: string;
    courseId: string;
    courseName: string;
    currentGrade: number;
    previousGrade: number;
    assignments: { title: string; grade: number; maxGrade: number }[];
    tests: { title: string; grade: number; maxGrade: number }[];
    trend: 'up' | 'down' | 'stable';
}

const ParentProgress = () => {
    const router = useRouter();
    const { id } = router.query;
    const [progress, setProgress] = useState<ProgressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                const mockData: ProgressData[] = [
                    {
                        childId: 'c1',
                        childName: 'John Doe',
                        courseId: 'course1',
                        courseName: 'Mathematics',
                        currentGrade: 85,
                        previousGrade: 80,
                        trend: 'up',
                        assignments: [
                            { title: 'Algebra Assignment', grade: 90, maxGrade: 100 },
                            { title: 'Geometry Quiz', grade: 85, maxGrade: 100 }
                        ],
                        tests: [
                            { title: 'Midterm Exam', grade: 82, maxGrade: 100 }
                        ]
                    },
                    {
                        childId: 'c1',
                        childName: 'John Doe',
                        courseId: 'course2',
                        courseName: 'Science',
                        currentGrade: 92,
                        previousGrade: 90,
                        trend: 'up',
                        assignments: [
                            { title: 'Lab Report', grade: 95, maxGrade: 100 },
                            { title: 'Physics Quiz', grade: 90, maxGrade: 100 }
                        ],
                        tests: [
                            { title: 'Chemistry Test', grade: 88, maxGrade: 100 }
                        ]
                    }
                ];
                setProgress(mockData);
                setLoading(false);
            }, 1000);
        }
    }, [id]);

    const children = Array.from(new Set(progress.map(p => ({ id: p.childId, name: p.childName }))));
    const filteredProgress = selectedChild === 'all'
        ? progress
        : progress.filter(p => p.childId === selectedChild);

    const calculateOverallAverage = () => {
        if (filteredProgress.length === 0) return 0;
        const sum = filteredProgress.reduce((acc, p) => acc + p.currentGrade, 0);
        return (sum / filteredProgress.length).toFixed(1);
    };

    if (loading) {
        return (
            <PortalLayout userName="Parent" userRole="parent">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Parent" userRole="parent">
            <div className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <h1>Children&apos;s Progress</h1>
                        <p>Monitor your children&apos;s academic performance</p>
                    </div>
                    {children.length > 1 && (
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className={styles.childSelect}
                        >
                            <option value="all">All Children</option>
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                            ))}
                        </select>
                    )}
                </header>

                {filteredProgress.length > 0 && (
                    <div className={styles.overallStats}>
                        <div className={styles.overallCard}>
                            <Award size={24} />
                            <div>
                                <h3>Overall Average</h3>
                                <p className={styles.overallGrade}>{calculateOverallAverage()}%</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.progressContainer}>
                    {filteredProgress.length > 0 ? (
                        filteredProgress.map((item, idx) => (
                            <div key={`${item.childId}-${item.courseId}-${idx}`} className={styles.progressCard}>
                                <div className={styles.progressHeader}>
                                    <div>
                                        <h3>{item.courseName}</h3>
                                        <span className={styles.childName}>{item.childName}</span>
                                    </div>
                                    <div className={styles.gradeSection}>
                                        <div className={styles.currentGrade}>
                                            {item.currentGrade}%
                                        </div>
                                        <div className={`${styles.trendIndicator} ${styles[item.trend]}`}>
                                            {item.trend === 'up' && <TrendingUp size={16} />}
                                            {item.trend === 'down' && <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                                            {item.previousGrade !== item.currentGrade && (
                                                <span>
                                                    {item.trend === 'up' ? '+' : ''}
                                                    {(item.currentGrade - item.previousGrade).toFixed(1)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${item.currentGrade}%` }}
                                    />
                                </div>

                                {item.assignments.length > 0 && (
                                    <div className={styles.assignmentsSection}>
                                        <h4>Assignments</h4>
                                        <div className={styles.gradeList}>
                                            {item.assignments.map((assignment, aIdx) => (
                                                <div key={aIdx} className={styles.gradeItem}>
                                                    <span>{assignment.title}</span>
                                                    <span className={styles.gradeValue}>
                                                        {assignment.grade} / {assignment.maxGrade}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.tests.length > 0 && (
                                    <div className={styles.testsSection}>
                                        <h4>Tests</h4>
                                        <div className={styles.gradeList}>
                                            {item.tests.map((test, tIdx) => (
                                                <div key={tIdx} className={styles.gradeItem}>
                                                    <span>{test.title}</span>
                                                    <span className={styles.gradeValue}>
                                                        {test.grade} / {test.maxGrade}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <BarChart2 size={48} />
                            <h3>No progress data</h3>
                            <p>Progress information will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
};

export default ParentProgress;
