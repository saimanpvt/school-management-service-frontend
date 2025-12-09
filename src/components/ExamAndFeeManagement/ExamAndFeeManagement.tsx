// Example of how to integrate ExamForm and FeeForm components
// You can use this as a reference to add these modals to your admin pages

import React, { useState } from 'react';
import ExamForm from '../../../components/ExamForm/ExamForm';
import FeeForm from '../../../components/FeeForm/FeeForm';
import { ExamFormData, FeeStructureFormData } from '../../../lib/types';
import { examsApi, feesApi } from '../../../services/api';

const ExamAndFeeManagement: React.FC = () => {
  // State for modals
  const [showExamModal, setShowExamModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);

  // State for form data
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
    resultsPublished: false,
  });

  const [feeFormData, setFeeFormData] = useState<FeeStructureFormData>({
    name: '',
    description: '',
    course: '',
    academicYear: '',
    semester: 'Spring',
    feeComponents: [],
    totalAmount: 0,
    discountPercentage: 0,
    lateFeePercentage: 0,
    lateFeeGraceDays: 0,
    isActive: true,
    validFrom: '',
    validTo: '',
  });

  // Example data - replace with actual API calls
  const [courseOptions] = useState([
    { value: '1', label: 'Computer Science 101' },
    { value: '2', label: 'Mathematics 101' },
    { value: '3', label: 'Physics 101' },
  ]);

  const [classOptions] = useState([
    { value: '1', label: 'Class A' },
    { value: '2', label: 'Class B' },
    { value: '3', label: 'Class C' },
  ]);

  // Handle exam form submission
  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await examsApi.create(examFormData);
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
        resultsPublished: false,
      });
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam. Please try again.');
    }
  };

  // Handle fee form submission
  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await feesApi.create(feeFormData);
      alert('Fee structure created successfully!');
      setShowFeeModal(false);
      // Reset form
      setFeeFormData({
        name: '',
        description: '',
        course: '',
        academicYear: '',
        semester: 'Spring',
        feeComponents: [],
        totalAmount: 0,
        discountPercentage: 0,
        lateFeePercentage: 0,
        lateFeeGraceDays: 0,
        isActive: true,
        validFrom: '',
        validTo: '',
      });
    } catch (error) {
      console.error('Error creating fee structure:', error);
      alert('Failed to create fee structure. Please try again.');
    }
  };

  return (
    <div>
      <h1>Exam and Fee Management</h1>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setShowExamModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Add New Exam
        </button>

        <button
          onClick={() => setShowFeeModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Add Fee Structure
        </button>
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

      {/* Fee Modal */}
      {showFeeModal && (
        <FeeForm
          formData={feeFormData}
          setFormData={setFeeFormData}
          onSubmit={handleFeeSubmit}
          onClose={() => setShowFeeModal(false)}
          courseOptions={courseOptions}
          isEdit={false}
        />
      )}
    </div>
  );
};

export default ExamAndFeeManagement;

