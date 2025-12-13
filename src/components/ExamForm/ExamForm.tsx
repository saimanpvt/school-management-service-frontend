import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ExamForm.module.css';
import { ExamFormData } from '../../lib/types';

interface ExamFormProps {
  formData: ExamFormData;
  setFormData: (data: ExamFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  courseOptions: { value: string; label: string }[];
  classOptions: { value: string; label: string }[];
  isEdit?: boolean;
}

const ExamForm: React.FC<ExamFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  courseOptions,
  isEdit = false,
}) => {
  const [formError, setFormError] = useState('');

  const examTypeOptions = [
    'Quiz',
    'Midterm',
    'Final',
    'Assignment',
    'Project',
    'Presentation',
    'Lab',
    'Practical',
  ];

  // Generate academic year options (current year and next few years)
  const currentYear = new Date().getFullYear();
  const academicYearOptions = [];
  for (let i = -1; i <= 3; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    academicYearOptions.push(`${startYear}-${endYear}`);
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value ? Number(value) : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const missing = [];

    // Required fields validation
    if (!formData.examName) missing.push('Exam Name');
    if (!formData.examType) missing.push('Exam Type');
    if (!formData.course) missing.push('Course');
    if (!formData.classId) missing.push('Class');
    if (!formData.academicYear) missing.push('Academic Year');
    if (!formData.totalMarks) missing.push('Total Marks');
    if (!formData.passingMarks) missing.push('Passing Marks');
    if (!formData.examDate) missing.push('Exam Date');
    if (!formData.startTime) missing.push('Start Time');
    if (!formData.endTime) missing.push('End Time');
    if (!formData.duration) missing.push('Duration');
    if (!formData.venue) missing.push('Venue');

    if (missing.length > 0) {
      setFormError('Please fill all required fields: ' + missing.join(', '));
      return;
    }

    // Validate passing marks doesn't exceed total marks
    if (formData.passingMarks > formData.totalMarks) {
      setFormError('Passing marks cannot exceed total marks');
      return;
    }

    // Validate start time is before end time
    const startMinutes = formData.startTime.split(':').map(Number);
    const endMinutes = formData.endTime.split(':').map(Number);
    const startTotalMinutes = startMinutes[0] * 60 + startMinutes[1];
    const endTotalMinutes = endMinutes[0] * 60 + endMinutes[1];

    if (endTotalMinutes <= startTotalMinutes) {
      setFormError('End time must be after start time');
      return;
    }

    onSubmit(e);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={`${styles.formContainer} ${styles.largeForm}`}>
        <div className={styles.formHeader}>
          <h2>{isEdit ? 'Edit Exam' : 'Add New Exam'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {formError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{formError}</div>
        )}

        <form id="examForm" onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Exam Name *</label>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                onChange={handleInputChange}
                maxLength={100}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Exam Type *</label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Exam Type</option>
                {examTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Course *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Course</option>
                {courseOptions.map((course) => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Class *</label>
              {/* <select
                                name="classId"
                                value={formData.classId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Class</option>
                                {classOptions.map(cls => (
                                    <option key={cls.value} value={cls.value}>{cls.label}</option>
                                ))}
                            </select> */}
              <input
                type="text"
                name="classId"
                value={formData.classId}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Academic Year *</label>
              <select
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Academic Year</option>
                {academicYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Total Marks *</label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks || ''}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Passing Marks *</label>
              <input
                type="number"
                name="passingMarks"
                value={formData.passingMarks || ''}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Exam Date *</label>
              <input
                type="date"
                name="examDate"
                value={formData.examDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration || ''}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Start Time *</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Time *</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions || ''}
              onChange={handleInputChange}
              maxLength={1000}
              rows={3}
              placeholder="Enter exam instructions (optional)"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive ?? true}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="isCompleted"
                  checked={formData.isCompleted ?? false}
                  onChange={handleInputChange}
                />
                Completed
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label>
                <input
                  type="checkbox"
                  name="resultsPublished"
                  checked={formData.resultsPublished ?? false}
                  onChange={handleInputChange}
                />
                Results Published
              </label>
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
            form="examForm"
          >
            {isEdit ? 'Update Exam' : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamForm;
