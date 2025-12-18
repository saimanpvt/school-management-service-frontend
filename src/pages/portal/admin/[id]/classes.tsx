import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { BookOpen, Plus, Search, Edit, Trash2, Users } from 'lucide-react';
import { DEFAULT_CLASS_FORM } from '../../../../lib/constants';
import { filterClasses } from '../../../../lib/helpers';
import { ClassFormData, ClassData } from '../../../../lib/types';
import AlertModal from '../../../../components/AlertModal';
import ClassForm from '../../../../components/ClassForm/ClassForm';
import { useNotification } from '../../../../components/Toaster';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

const AdminClasses = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useNotification();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClassFormData>(DEFAULT_CLASS_FORM);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    classId: string;
    className: string;
  }>({ isOpen: false, classId: '', className: '' });

  useEffect(() => {
    if (id) {
      fetchClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredClasses = filterClasses(classes, searchTerm);

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

  const openDeleteModal = (classId: string, className: string) => {
    setDeleteModal({ isOpen: true, classId, className });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, classId: '', className: '' });
  };

  const confirmDelete = async () => {
    try {
      await apiServices.classes.delete(deleteModal.classId);
      setClasses(classes.filter((c) => c._id !== deleteModal.classId));
      addNotification({
        type: 'success',
        title: 'Class deleted successfully!',
        message: `${deleteModal.className} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      addNotification({
        type: 'error',
        title: 'Failed to delete class',
        message: 'Please try again later.',
      });
    } finally {
      closeDeleteModal();
    }
  };

  // Navigate to class details
  const handleClassDetails = (classId: string) => {
    router.push(`/portal/admin/${id}/class-details/${classId}`);
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
          addNotification({
            type: 'success',
            title: 'Class updated successfully!',
            message: `${formData.className} has been updated.`,
          });
          // Update the classes list with the updated data
          setClasses(
            classes.map((cls) =>
              cls._id === editingClassId ? { ...cls, ...formData } : cls
            )
          );
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to update class',
            message: 'Please try again later.',
          });
        }
      } else {
        // Create new class
        response = await apiServices.classes.create(formData);
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'Class created successfully!',
            message: `${formData.className} has been created.`,
          });
          // Refresh classes list
          fetchClasses();
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to create class',
            message: 'Please try again later.',
          });
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
      addNotification({
        type: 'error',
        title: 'Error saving class',
        message: 'An unexpected error occurred. Please try again.',
      });
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

              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => (
                <tr key={cls._id}>
                  <td>
                    <span
                      className={styles.clickableId}
                      onClick={() => handleClassDetails(cls._id)}
                      title="View class details"
                    >
                      {cls.classID}
                    </span>
                  </td>
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
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => openDeleteModal(cls._id, cls.className)}
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

      {/* Class Form Modal */}
      {showAddForm && (
        <ClassForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
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
          isEdit={isEditMode}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <AlertModal
          usage="delete"
          mainText="Delete Class"
          subText={`Are you sure you want to delete "${deleteModal.className}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      )}
    </PortalLayout>
  );
};

export default AdminClasses;
