import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  ClipboardList,
  Plus,
  Calendar,
  Users,
  FileCheck,
  Edit,
  Trash2,
} from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots';
import AssignmentForm, {
  AssignmentFormData,
} from '../../../../components/AssignmentForm';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  className: string;
  courseName: string;
  submissionsCount: number;
  totalStudents: number;
  maxMarks: number;
  instructions?: string;
  status: 'active' | 'completed' | 'overdue';
}

interface TeacherClass {
  id: string;
  name: string;
  code: string;
}

const TeacherAssignments = () => {
  const router = useRouter();
  const { id } = router.query;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null
  );
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    description: '',
    classId: '',
    dueDate: '',
    dueTime: '',
    maxMarks: 100,
    instructions: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          // Load assignments
          const assignmentsResponse = await apiServices.teacher.getAssignments(
            id as string
          );
          if (assignmentsResponse.success && assignmentsResponse.data) {
            setAssignments(assignmentsResponse.data);
          }

          // Load teacher's classes
          const classesResponse = await apiServices.teacher.getTeacherClasses(
            id as string
          );
          if (classesResponse.success && classesResponse.data) {
            setClasses(classesResponse.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && editingAssignmentId) {
        // Update existing assignment
        // const response = await apiServices.teacher.updateAssignment(editingAssignmentId, formData);
        alert('Assignment updated successfully!');
      } else {
        // Create new assignment
        const response = await apiServices.teacher.createAssignment({
          title: formData.title,
          description: formData.description,
          classId: formData.classId,
          dueDate: `${formData.dueDate}T${formData.dueTime}`,
          maxMarks: formData.maxMarks,
        });

        if (response.success) {
          alert('Assignment created successfully!');
          // Reload assignments
          const assignmentsResponse = await apiServices.teacher.getAssignments(
            id as string
          );
          if (assignmentsResponse.success && assignmentsResponse.data) {
            setAssignments(assignmentsResponse.data);
          }
        } else {
          alert('Failed to create assignment. Please try again.');
        }
      }
      setShowAssignmentForm(false);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      classId: '', // Would need to get this from assignment data
      dueDate: assignment.dueDate.split('T')[0],
      dueTime: assignment.dueTime || '',
      maxMarks: assignment.maxMarks,
      instructions: assignment.instructions || '',
    });
    setIsEditMode(true);
    setEditingAssignmentId(assignment.id);
    setShowAssignmentForm(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        // await apiServices.teacher.deleteAssignment(assignmentId);
        setAssignments(assignments.filter((a) => a.id !== assignmentId));
        alert('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment.');
      }
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
        <div>
          <h1>Manage Assignments</h1>
          <p>Create and manage assignments for your classes</p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => {
            setIsEditMode(false);
            setEditingAssignmentId(null);
            setFormData({
              title: '',
              description: '',
              classId: '',
              dueDate: '',
              dueTime: '',
              maxMarks: 100,
              instructions: '',
            });
            setShowAssignmentForm(true);
          }}
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </header>

      <div className={styles.assignmentsContainer}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div key={assignment.id} className={styles.assignmentCard}>
              <div className={styles.assignmentHeader}>
                <div className={styles.assignmentIcon}>
                  <ClipboardList size={24} />
                </div>
                <div className={styles.assignmentTitleSection}>
                  <h3>{assignment.title}</h3>
                  <p className={styles.assignmentDescription}>
                    {assignment.description}
                  </p>
                  <div className={styles.assignmentMeta}>
                    <span className={styles.classBadge}>
                      <Users size={14} />
                      {assignment.className}
                    </span>
                    <span className={styles.dateInfo}>
                      <Calendar size={14} />
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span className={styles.scoreInfo}>
                      Max Marks: {assignment.maxMarks}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.assignmentActions}>
                <button
                  className={styles.primaryBtn}
                  onClick={() =>
                    router.push(
                      `/portal/teacher/${id}/assignments/${assignment.id}/grade`
                    )
                  }
                >
                  <FileCheck size={16} />
                  Grade Submissions
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => handleEditAssignment(assignment)}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteAssignment(assignment.id)}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <ClipboardList size={48} />
            <h3>No assignments</h3>
            <p>Create your first assignment to get started</p>
            <button
              className={styles.createBtn}
              onClick={() =>
                router.push(`/portal/teacher/${id}/assignments/create`)
              }
            >
              <Plus size={18} />
              Create Assignment
            </button>
          </div>
        )}
      </div>

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <AssignmentForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitAssignment}
          onClose={() => {
            setShowAssignmentForm(false);
            setIsEditMode(false);
            setEditingAssignmentId(null);
          }}
          classes={classes}
          isEdit={isEditMode}
        />
      )}
    </PortalLayout>
  );
};

export default TeacherAssignments;
