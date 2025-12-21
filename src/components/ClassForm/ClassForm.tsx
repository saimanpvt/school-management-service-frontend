import React from 'react';
import { X } from 'lucide-react';
import { ClassFormData } from '../../lib/types';
import styles from './ClassForm.module.css';

interface ClassFormProps {
  formData: ClassFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClassFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEdit?: boolean;
  loading?: boolean;
}

const ClassForm: React.FC<ClassFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  isEdit = false,
  loading = false,
}) => {
  return (
    <div className={styles.formOverlay}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h2>{isEdit ? 'Edit Class' : 'Add New Class'}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.form}>
          <form id="classForm" onSubmit={onSubmit}>
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

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter class description (optional)"
                  rows={3}
                />
              </div>
            </div>
          </form>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              form="classForm"
            >
              {loading
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Class'
                : 'Create Class'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;
