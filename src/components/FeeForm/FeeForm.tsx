import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import styles from './FeeForm.module.css';
import { FeeStructureFormData, FeeComponent } from '../../lib/types';

interface FeeFormProps {
  formData: FeeStructureFormData;
  setFormData: (data: FeeStructureFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  courseOptions: { value: string; label: string }[];
  isEdit?: boolean;
}

const FeeForm: React.FC<FeeFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onClose,
  courseOptions,
  isEdit = false,
}) => {
  const [formError, setFormError] = useState('');

  const semesterOptions = ['Spring', 'Summer', 'Fall', 'Winter'];
  const frequencyOptions = [
    'One-time',
    'Monthly',
    'Quarterly',
    'Semester',
    'Annual',
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

  const handleComponentChange = (
    index: number,
    field: keyof FeeComponent,
    value: any,
  ) => {
    const updatedComponents = [...formData.feeComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      [field]: value,
    };
    // Recalculate total amount
    const totalAmount = updatedComponents.reduce(
      (sum, component) => sum + component.amount,
      0
    );
    setFormData({
      ...formData,
      feeComponents: updatedComponents,
      totalAmount,
    });
  };

  const addFeeComponent = () => {
    const newComponent: FeeComponent = {
      name: '',
      amount: 0,
      isMandatory: true,
      description: '',
      dueDate: '',
      isRecurring: false,
      frequency: 'One-time',
    };

    setFormData({
      ...formData,
      feeComponents: [...formData.feeComponents, newComponent],
    });
  };

  const removeFeeComponent = (index: number) => {
    const updatedComponents = formData.feeComponents.filter(
      (_, i) => i !== index
    );
    const totalAmount = updatedComponents.reduce(
      (sum, component) => sum + component.amount,
      0
    );

    setFormData({
      ...formData,
      feeComponents: updatedComponents,
      totalAmount,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const missing = [];

    // Required fields validation
    if (!formData.name) missing.push('Fee Structure Name');
    if (!formData.course) missing.push('Course');
    if (!formData.academicYear) missing.push('Academic Year');
    if (!formData.semester) missing.push('Semester');
    if (!formData.validFrom) missing.push('Valid From Date');
    if (!formData.validTo) missing.push('Valid To Date');

    // Validate fee components
    if (formData.feeComponents.length === 0) {
      missing.push('At least one Fee Component');
    } else {
      formData.feeComponents.forEach((component, index) => {
        if (!component.name) missing.push(`Fee Component ${index + 1} Name`);
        if (!component.amount || component.amount <= 0)
          missing.push(`Fee Component ${index + 1} Amount`);
      });
    }

    if (missing.length > 0) {
      setFormError('Please fill all required fields: ' + missing.join(', '));
      return;
    }

    // Validate valid dates
    if (new Date(formData.validTo) <= new Date(formData.validFrom)) {
      setFormError('Valid To date must be after Valid From date');
      return;
    }

    onSubmit(e);
  };

  return (
    <div className={styles.formOverlay}>
      <div className={`${styles.formContainer} ${styles.extraLargeForm}`}>
        <div className={styles.formHeader}>
          <h2>{isEdit ? 'Edit Fee Structure' : 'Add New Fee Structure'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {formError && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{formError}</div>
        )}

        <form
          onSubmit={handleFormSubmit}
          className={styles.form}
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Fee Structure Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={100}
                required
              />
            </div>
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
              <label>Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              maxLength={500}
              rows={3}
              placeholder="Enter description (optional)"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Valid From *</label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Valid To *</label>
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Discount Percentage (%)</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage || ''}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Late Fee Percentage (%)</label>
              <input
                type="number"
                name="lateFeePercentage"
                value={formData.lateFeePercentage || ''}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Late Fee Grace Days</label>
              <input
                type="number"
                name="lateFeeGraceDays"
                value={formData.lateFeeGraceDays || ''}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount || ''}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#64748b' }}>
                Auto-calculated from fee components
              </small>
            </div>
          </div>

          {/* Fee Components Section */}
          <div style={{ marginTop: '2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>
                Fee Components
              </h3>
              <button
                type="button"
                onClick={addFeeComponent}
                className={styles.addButton}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus size={16} />
                Add Component
              </button>
            </div>

            {formData.feeComponents.map((component, index) => (
              <div
                key={index}
                className={styles.componentCard}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  backgroundColor: '#f9fafb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <h4
                    style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}
                  >
                    Component {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeFeeComponent(index)}
                    className={styles.removeButton}
                    style={{ color: '#ef4444', padding: '0.25rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Component Name *</label>
                    <input
                      type="text"
                      value={component.name}
                      onChange={(e) =>
                        handleComponentChange(index, 'name', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Amount *</label>
                    <input
                      type="number"
                      value={component.amount || ''}
                      onChange={(e) =>
                        handleComponentChange(
                          index,
                          'amount',
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={component.dueDate || ''}
                      onChange={(e) =>
                        handleComponentChange(index, 'dueDate', e.target.value)
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Frequency</label>
                    <select
                      value={component.frequency || 'One-time'}
                      onChange={(e) =>
                        handleComponentChange(
                          index,
                          'frequency',
                          e.target.value
                        )
                      }
                    >
                      {frequencyOptions.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea
                    value={component.description || ''}
                    onChange={(e) =>
                      handleComponentChange(
                        index,
                        'description',
                        e.target.value
                      )
                    }
                    maxLength={200}
                    rows={2}
                    placeholder="Component description (optional)"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.checkboxGroup}>
                    <label>
                      <input
                        type="checkbox"
                        checked={component.isMandatory ?? true}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            'isMandatory',
                            e.target.checked
                          )
                        }
                      />
                      Mandatory
                    </label>
                  </div>
                  <div className={styles.checkboxGroup}>
                    <label>
                      <input
                        type="checkbox"
                        checked={component.isRecurring ?? false}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            'isRecurring',
                            e.target.checked
                          )
                        }
                      />
                      Recurring
                    </label>
                  </div>
                </div>
              </div>
            ))}
            {formData.feeComponents.length === 0 && (
              <p
                style={{
                  color: '#64748b',
                  textAlign: 'center',
                  padding: '2rem',
                }}
              >No fee components added. Click "Add Component" to add fee
                components.
              </p>
            )}
          </div>
          <div className={styles.checkboxGroup} style={{ marginTop: '1rem' }}>
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
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {isEdit ? 'Update Fee Structure' : 'Create Fee Structure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeForm;
