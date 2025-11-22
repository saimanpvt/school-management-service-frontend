import React, { useState } from 'react';
import { CourseFormData } from '../types/course';
import styles from '../pages/portal/admin/[id]/admin.module.css';

interface CourseFormProps {
    formData: CourseFormData;
    setFormData: (data: CourseFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    onClose,
    // teacherOptions and classOptions removed
    isEdit = false,
}) => {
    const [formError, setFormError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'duration' ? Number(value) : value,
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        const missing = [];
        if (!formData.courseCode) missing.push('Course Code');
        if (!formData.courseName) missing.push('Course Name');
        if (!formData.duration) missing.push('Duration');
        if (!formData.teacherId) missing.push('Teacher ID');
        if (!formData.classId) missing.push('Class ID');
        if (!formData.academicYear) missing.push('Academic Year');
        if (!formData.department) missing.push('Department');
        if (!formData.credits && formData.credits !== 0) missing.push('Credits');
        if (!formData.startDate) missing.push('Start Date');
        if (!formData.endDate) missing.push('End Date');
        if (!formData.semester) missing.push('Semester');
        if (missing.length > 0) {
            setFormError('Please fill all required fields: ' + missing.join(', '));
            return;
        }
        onSubmit(e);
    };

    return (
        <div className={styles.formOverlay}>
            <div className={`${styles.formContainer} ${styles.largeForm}`}>
                <div className={styles.formHeader}>
                    <h2>{isEdit ? 'Edit Course' : 'Add New Course'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                {formError && <div style={{ color: 'red', marginBottom: 8 }}>{formError}</div>}
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Course Code *</label>
                            <input type="text" name="courseCode" value={formData.courseCode} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Course Name *</label>
                            <input type="text" name="courseName" value={formData.courseName} onChange={handleInputChange} required maxLength={100} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} maxLength={500} />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Department *</label>
                            <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Credits *</label>
                            <input type="number" name="credits" value={formData.credits ?? ''} onChange={handleInputChange} min={0} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Start Date *</label>
                            <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>End Date *</label>
                            <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Semester *</label>
                            <input type="text" name="semester" value={formData.semester || ''} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Duration (months) *</label>
                            <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} min={1} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Academic Year *</label>
                            <input type="text" name="academicYear" value={formData.academicYear} onChange={handleInputChange} placeholder="YYYY-YYYY" pattern="^\d{4}-\d{4}$" required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Teacher ID *</label>
                            <input
                                type="text"
                                name="teacherId"
                                value={formData.teacherId}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Teacher ID"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Class ID *</label>
                            <input
                                type="text"
                                name="classId"
                                value={formData.classId}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter Class ID"
                            />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>
                            <input type="checkbox" name="isActive" checked={formData.isActive ?? true} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                            {' '}Active
                        </label>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        {isEdit ? 'Update Course' : 'Create Course'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;
