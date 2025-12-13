import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { FileText, Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import ExamForm from '../../../../components/ExamForm/ExamForm';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { TEACHER_EXAM_CONSTANTS } from '../../../../lib/constants';
import { formatDateForTeacher } from '../../../../lib/helpers';
import { ExamFormData, TeacherExam } from '../../../../lib/types';

const TeacherExams = () => {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState<TeacherExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamForm, setShowExamForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [classes, setClasses] = useState<
    { id: string; name: string; code: string }[]
  >([]);
  const [examFormData, setExamFormData] = useState<ExamFormData>(
    TEACHER_EXAM_CONSTANTS.DEFAULT_FORM
  );
  const { addNotification } = useNotification();

  const loadExams = async () => {
    if (id) {
      try {
        setLoading(true);
        // Use real API call to get exams
        const response = await apiServices.exams.getAll();
        if (response.success && response.data) {
          // Transform API data to match TeacherExam interface if needed
          const examsData = Array.isArray(response.data) ? response.data : [];
          setExams(examsData);
        } else {
          setExams([]);
          addNotification({
            type: 'error',
            title: 'Failed to load exams',
            message: 'Please try again later.',
          });
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        addNotification({
          type: 'error',
          title: 'Error loading exams',
          message: 'Please try again later.',
        });
        setExams([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadExams();
  }, [id]);

  const handleSubmitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingExamId) {
        // Update existing exam via API
        const response = await apiServices.exams.update(
          editingExamId,
          examFormData
        );
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Exam updated successfully!',
            message: 'The exam has been updated.',
          });
          // Reload exams to get fresh data
          await loadExams();
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to update exam',
            message: 'Please try again later.',
          });
        }
      } else {
        // Create new exam via API
        const response = await apiServices.exams.create(examFormData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Exam created successfully!',
            message: 'The exam has been created and is now available.',
          });
          // Reload exams to get fresh data
          await loadExams();
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to create exam',
            message: 'Please try again later.',
          });
        }
      }

      // Reset form state on success
      setShowExamForm(false);
      setIsEditMode(false);
      setEditingExamId(null);
      setExamFormData(TEACHER_EXAM_CONSTANTS.DEFAULT_FORM);
    } catch (error) {
      console.error('Error submitting exam:', error);
      addNotification({
        type: 'error',
        title: 'Failed to submit exam',
        message: 'Please try again later.',
      });
    }
  };

  if (loading) {
    return (
      <PortalLayout userName="Teacher" userRole="teacher">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Teacher" userRole="teacher">
      <header className={styles.header}>
        <div className={styles.examHeader}>
          <div>
            <h1>Manage Exams</h1>
            <p>Schedule and manage exams for your classes</p>
          </div>
          <button
            className={styles.createBtn}
            onClick={() => {
              setIsEditMode(false);
              setEditingExamId(null);
              setExamFormData(TEACHER_EXAM_CONSTANTS.DEFAULT_FORM);
              setShowExamForm(true);
            }}
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </header>

      <div className={styles.examsContainer}>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examHeader}>
                <div className={styles.examIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.examTitleSection}>
                  <h3>{exam.title}</h3>
                  <div className={styles.examMeta}>
                    <span className={styles.classBadge}>
                      <Users size={14} />
                      {exam.className}
                    </span>
                    <span className={styles.subjectBadge}>{exam.subject}</span>
                    <span
                      className={styles.statusBadge}
                      data-status={exam.status}
                    >
                      {exam.status.charAt(0).toUpperCase() +
                        exam.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.examDetails}>
                <div className={styles.examDetailItem}>
                  <Calendar size={16} />
                  <span>{formatDateForTeacher(exam.date)}</span>
                </div>
                <div className={styles.examDetailItem}>
                  <Clock size={16} />
                  <span>
                    {exam.time} ({exam.duration})
                  </span>
                </div>
                <div className={styles.examDetailItem}>
                  <MapPin size={16} />
                  <span>{exam.location}</span>
                </div>
                <div className={styles.examDetailItem}>
                  <Users size={16} />
                  <span>{exam.totalStudents} Students</span>
                </div>
              </div>
              <div className={styles.examActions}>
                <button
                  className={styles.primaryBtn}
                  onClick={() =>
                    router.push(`/portal/teacher/${id}/exams/${exam.id}`)
                  }
                >
                  View Details
                </button>
                {exam.status === 'upcoming' && (
                  <button
                    className={styles.secondaryBtn}
                    onClick={() =>
                      router.push(`/portal/teacher/${id}/exams/${exam.id}/edit`)
                    }
                  >
                    Edit Exam
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No exams scheduled</h3>
            <p>Create your first exam to get started</p>
          </div>
        )}
      </div>
      {/* Exam Form Modal */}
      {showExamForm && (
        <ExamForm
          formData={examFormData}
          setFormData={setExamFormData}
          onSubmit={handleSubmitExam}
          onClose={() => {
            setShowExamForm(false);
            setIsEditMode(false);
            setEditingExamId(null);
          }}
          courseOptions={[]}
          classOptions={classes.map((c) => ({ value: c.id, label: c.name }))}
          isEdit={isEditMode}
        />
      )}
    </PortalLayout>
  );
};

export default TeacherExams;
