import React, { useState } from 'react';
import { X, Calendar, FileText, Users, Clock } from 'lucide-react';
import styles from './AssignmentForm.module.css';

export interface AssignmentFormData {
  title: string;
  description: string;
  classId: string;
  dueDate: string;
  dueTime: string;
  maxMarks: number;
  instructions: string;
  attachments?: File[];
}

interface AssignmentFormProps {
  formData: AssignmentFormData;
  setFormData: (data: AssignmentFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  classes: Array<{ id: string; name: string; code: string }>;
  isEdit?: boolean;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  classes,
  isEdit = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Assignment title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.classId) {
      newErrors.classId = 'Please select a class';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    if (!formData.maxMarks || formData.maxMarks <= 0) {
      newErrors.maxMarks = 'Maximum marks must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const handleInputChange = (
    field: keyof AssignmentFormData,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? 'Edit Assignment' : 'Create New Assignment'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="title">
                <FileText size={16} />
                Assignment Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter assignment title"
                className={errors.title ? styles.errorInput : ''}
              />
              {errors.title && (
                <span className={styles.errorText}>{errors.title}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="classId">
                <Users size={16} />
                Select Class *
              </label>
              <select
                id="classId"
                value={formData.classId}
                onChange={(e) => handleInputChange('classId', e.target.value)}
                className={errors.classId ? styles.errorInput : ''}
              >
                <option value="">Choose a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
              {errors.classId && (
                <span className={styles.errorText}>{errors.classId}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">
                <Calendar size={16} />
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={errors.dueDate ? styles.errorInput : ''}
              />
              {errors.dueDate && (
                <span className={styles.errorText}>{errors.dueDate}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="dueTime">
                <Clock size={16} />
                Due Time *
              </label>
              <input
                type="time"
                id="dueTime"
                value={formData.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
                className={errors.dueTime ? styles.errorInput : ''}
              />
              {errors.dueTime && (
                <span className={styles.errorText}>{errors.dueTime}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxMarks">Maximum Marks *</label>
              <input
                type="number"
                id="maxMarks"
                value={formData.maxMarks || ''}
                onChange={(e) =>
                  handleInputChange('maxMarks', parseInt(e.target.value) || 0)
                }
                placeholder="100"
                min="1"
                className={errors.maxMarks ? styles.errorInput : ''}
              />
              {errors.maxMarks && (
                <span className={styles.errorText}>{errors.maxMarks}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the assignment objectives and requirements..."
              rows={4}
              className={errors.description ? styles.errorInput : ''}
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instructions">Additional Instructions</label>
            <textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange('instructions', e.target.value)
              }
              placeholder="Provide additional instructions, submission format, etc..."
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {isEdit ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
