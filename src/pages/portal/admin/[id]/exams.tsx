import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { ProtectedRoute } from '../../../../lib/auth';
import { apiServices } from '../../../../services/api';
import { FileText, Plus, Search, Calendar } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';
import ExamForm from '../../../../components/ExamForm';
import { ExamFormData } from '../../../../lib/types';

const AdminExams = () => {
    const router = useRouter();
    const { id } = router.query;
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showExamModal, setShowExamModal] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    // Exam form data state
    const [examFormData, setExamFormData] = useState<ExamFormData>({
        examName: '',
        examType: 'Quiz',
        course: '',
        classId: '',
        academicYear: '',
        totalMarks: 0,
        passingMarks: 0,
        examDate: '',
        startTime: '',
        endTime: '',
        duration: 0,
        venue: '',
        instructions: '',
        isActive: true,
        isCompleted: false,
        resultsPublished: false
    });

    useEffect(() => {
        if (id) {
            // Fetch exams, courses, and classes
            Promise.all([
                apiServices.exams.getAll(),
                apiServices.courses.getAll(),
                apiServices.classes.getAll()
            ])
                .then(([examsResponse, coursesResponse, classesResponse]) => {
                    if (examsResponse.success) {
                        setExams(examsResponse.data || []);
                    }
                    if (coursesResponse.success) {
                        setCourses(coursesResponse.data || []);
                    }
                    if (classesResponse.success) {
                        setClasses(classesResponse.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    // Handle exam form submission
    const handleExamSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await apiServices.exams.create(examFormData);
            if (response.success) {
                alert('Exam created successfully!');
                setShowExamModal(false);
                // Reset form
                setExamFormData({
                    examName: '',
                    examType: 'Quiz',
                    course: '',
                    classId: '',
                    academicYear: '',
                    totalMarks: 0,
                    passingMarks: 0,
                    examDate: '',
                    startTime: '',
                    endTime: '',
                    duration: 0,
                    venue: '',
                    instructions: '',
                    isActive: true,
                    isCompleted: false,
                    resultsPublished: false
                });
                // Refresh exams list
                const examsResponse = await apiServices.exams.getAll();
                if (examsResponse.success) {
                    setExams(examsResponse.data || []);
                }
            } else {
                alert('Failed to create exam: ' + (response.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating exam:', error);
            alert('Failed to create exam. Please try again.');
        }
    };

    // Prepare options for dropdowns
    const courseOptions = courses.map(course => ({
        value: course._id || course.id,
        label: `${course.courseCode} - ${course.courseName}`
    }));

    const classOptions = classes.map(cls => ({
        value: cls._id || cls.id,
        label: cls.className || cls.name
    }));

    if (loading) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
            <header className={styles.pageHeader}>
                <div>
                    <h1>Manage Exams</h1>

                </div>
                <div className={styles.examContainer}>
                    <p>View and manage all exams in the system</p>
                    <button
                        className={styles.createBtn}
                        onClick={() => setShowExamModal(true)}
                    >
                        <Plus size={18} />
                        Add Exam
                    </button>
                </div>
            </header>

            <div className={styles.gridContainer}>
                {exams.length > 0 ? (
                    exams.map(exam => (
                        <div key={exam.id} className={styles.card}>
                            <h3>{exam.title || 'N/A'}</h3>
                            <p>{exam.subject || 'N/A'}</p>
                            <div className={styles.cardMeta}>
                                <span><Calendar size={14} /> {exam.date || 'N/A'}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FileText size={48} />
                        <h3>No exams found</h3>
                        <p>No exams scheduled in the system</p>
                    </div>
                )}
            </div>

            {/* Exam Modal */}
            {showExamModal && (
                <ExamForm
                    formData={examFormData}
                    setFormData={setExamFormData}
                    onSubmit={handleExamSubmit}
                    onClose={() => setShowExamModal(false)}
                    courseOptions={courseOptions}
                    classOptions={classOptions}
                    isEdit={false}
                />
            )}
        </PortalLayout>
    );
};

export default AdminExams;

