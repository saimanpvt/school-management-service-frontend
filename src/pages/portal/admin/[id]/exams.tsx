import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { EXAM_CONSTANTS } from '../../../../lib/constants';
import { resetFormData } from '../../../../lib/helpers';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import ExamForm from '../../../../components/ExamForm/ExamForm';
import { ExamFormData } from '../../../../lib/types';
import { useNotification } from '../../../../components/Toaster/Toaster';

const AdminExams = () => {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamModal, setShowExamModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    examId: '',
    examName: '',
  });
  const { addNotification } = useNotification();

  // Exam form data state
  const [examFormData, setExamFormData] = useState<ExamFormData>(
    EXAM_CONSTANTS.DEFAULT_FORM
  );

  useEffect(() => {
    if (id) {
      // Fetch exams, courses, and classes
      Promise.all([
        apiServices.exams.getAll(),
        apiServices.courses.getAll(),
        apiServices.classes.getAll(),
      ])
        .then(([examsResponse, coursesResponse, classesResponse]) => {
          console.log('Exams API Response:', examsResponse); // Debug log
          if (examsResponse.success) {

            const examsData = examsResponse.exams || [];
            setExams(Array.isArray(examsData) ? examsData : []);
          }
          if (coursesResponse.success) {
            setCourses(
              Array.isArray(coursesResponse.data) ? coursesResponse.data : []
            );
          }
          if (classesResponse.success) {
            let allClasses: any[] = [];
            if (Array.isArray(classesResponse.data)) {
              allClasses = classesResponse.data;
            } else if (
              classesResponse.data &&
              typeof classesResponse.data === 'object'
            ) {
              // Handle possible structure: { ongoing: [...], completed: [...], inactive: [...] }
              const {
                ongoing = [],
                completed = [],
                inactive = [],
              } = classesResponse.data as {
                ongoing?: any[];
                completed?: any[];
                inactive?: any[];
              };
              allClasses = [...ongoing, ...completed, ...inactive];
            }
            setClasses(allClasses);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle exam form submission
  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode && editingExamId) {
        // Edit existing exam
        response = await apiServices.exams.update(editingExamId, examFormData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Exam updated successfully!',
            message: 'The exam has been updated.',
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to update exam',
            message: response.error || 'Unknown error',
          });
        }
      } else {
        // Create new exam
        response = await apiServices.exams.create(examFormData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Exam created successfully!',
            message: 'The exam has been created.',
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to create exam',
            message: response.error || 'Unknown error',
          });
        }
      }

      if (response.success) {
        setShowExamModal(false);
        setIsEditMode(false);
        setEditingExamId(null);
        // Reset form
        setExamFormData(resetFormData(EXAM_CONSTANTS.DEFAULT_FORM));
        // Refresh exams list
        const examResponse = await apiServices.exams.getAll();
        if (examResponse.success) {
          const examsData = examResponse.data || [];
          setExams(Array.isArray(examsData) ? examsData : []);
        }
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      addNotification({
        type: 'error',
        title: 'Failed to submit exam',
        message: 'Please try again later.',
      });
    }
  };

  // Handle edit exam
  const handleEditExam = (exam: any) => {
    setExamFormData({
      examName: exam.examName || '',
      examType: exam.examType || 'Quiz',
      courseCode: exam.courseCode || '',
      totalMarks: exam.totalMarks || 0,
      passingMarks: exam.passingMarks || 0,
      examDate: exam.examDate || '',
      duration: exam.duration || 0,
      venue: exam.venue || '',
      instructions: exam.instructions || '',
    });
    setIsEditMode(true);
    setEditingExamId(exam._id);
    setShowExamModal(true);
  };

  // Handle add new exam
  const handleAddNewExam = () => {
    setExamFormData(resetFormData(EXAM_CONSTANTS.DEFAULT_FORM));
    setIsEditMode(false);
    setEditingExamId(null);
    setShowExamModal(true);
  };

  // Handle delete exam
  const handleDeleteExam = (exam: any) => {
    setDeleteModal({
      isOpen: true,
      examId: exam._id,
      examName: exam.examName,
    });
  };

  // Confirm delete exam
  const confirmDeleteExam = async () => {
    try {
      const response = await apiServices.exams.delete(deleteModal.examId);
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Exam deleted successfully!',
          message: 'The exam has been removed from the system.',
        });
        // Refresh exams list
        const examResponse = await apiServices.exams.getAll();
        if (examResponse.success) {
          const examsData = examResponse.data || [];
          setExams(Array.isArray(examsData) ? examsData : []);
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Failed to delete exam',
          message: response.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      addNotification({
        type: 'error',
        title: 'Failed to delete exam',
        message: 'Please try again later.',
      });
    }
    setDeleteModal({ isOpen: false, examId: '', examName: '' });
  };

  // Prepare options for dropdowns
  const courseOptions = courses.map((course) => ({
    value: course._id || course.id,
    label: `${course.courseCode} - ${course.courseName}`,
  }));

  if (loading) {
    return (
      <PortalLayout userName="Admin" userRole="admin">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
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
            onClick={handleAddNewExam}
          >
            <Plus size={18} />
            Add Exam
          </button>
        </div>
      </header>

      <div className={styles.tableContainer}>
        {exams.length > 0 ? (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Type</th>
                <th>Course Code</th>
                <th>Total Marks</th>
                <th>Date</th>
                <th>Duration</th>
                <th>Venue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.examName || 'N/A'}</td>
                  <td>{exam.examType || 'N/A'}</td>
                  <td>{exam.course.courseCode || 'N/A'}</td>
                  <td>{exam.totalMarks || 0}</td>
                  <td>
                    {exam.examDate
                      ? new Date(exam.examDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : 'N/A'
                    }
                  </td>
                  <td>{exam.duration ? `${exam.duration} mins` : 'N/A'}</td>
                  <td>{exam.venue || 'N/A'}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditExam(exam)}
                        title="Edit Exam"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteExam(exam)}
                        title="Delete Exam"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          onClose={() => {
            setShowExamModal(false);
            setIsEditMode(false);
            setEditingExamId(null);
          }}
          courseOptions={courseOptions}
          isEdit={isEditMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModal}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the exam <strong>"{deleteModal.examName}"</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.deleteModalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setDeleteModal({ isOpen: false, examId: '', examName: '' })}
              >
                Cancel
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={confirmDeleteExam}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};

export default AdminExams;
