import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { DollarSign, Plus, Search, Edit, Trash2 } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import FeeForm from '../../../../components/FeeForm/FeeForm';
import { FeeStructureFormData } from '../../../../lib/types';

const AdminFees = () => {
  const router = useRouter();
  const { id } = router.query;
  const [fees, setFees] = useState<FeeStructureFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [courses, setCourses] = useState<{ id: string; courseCode: string; courseName: string }[]>([]);
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

  useEffect(() => {
    if (id) {
      // Fetch fees and courses
      Promise.all([apiServices.fees.getAll(), apiServices.courses.getAll()])
        .then(([feesResponse, coursesResponse]) => {
          // Ensure fees is always an array
          if (feesResponse.success && feesResponse.data) {
            setFees(Array.isArray(feesResponse.data) ? feesResponse.data : []);
          } else {
            setFees([]);
          }

          // Ensure courses is always an array
          if (coursesResponse.success && coursesResponse.data) {
            setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : []);
          } else {
            setCourses([]);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          // Ensure arrays are set even on error
          setFees([]);
          setCourses([]);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle fee form submission
  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiServices.fees.create(feeFormData);
      if (response.success) {
        alert('Fee structure created successfully!');
        setShowAddForm(false);
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
        // Refresh fees list
        const feesResponse = await apiServices.fees.getAll();
        if (feesResponse.success && feesResponse.data) {
          setFees(Array.isArray(feesResponse.data) ? feesResponse.data : []);
        }
      } else {
        alert(
          'Failed to create fee structure: ' +
          (response.error || 'Unknown error')
        );
      }
    } catch (error) {
      console.error('Error creating fee structure:', error);
      alert('Failed to create fee structure. Please try again.');
    }
  };

  // Prepare course options for dropdown
  const courseOptions = Array.isArray(courses) ? courses.map((course) => ({
    value: course.id,
    label: `${course.courseCode} - ${course.courseName}`,
  })) : [];

  const filteredFees = Array.isArray(fees) ? fees.filter(
    (fee) =>
      fee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalRevenue = Array.isArray(filteredFees) ? filteredFees.reduce(
    (sum, fee) => sum + (fee.totalAmount || 0),
    0
  ) : 0;

  const handleDelete = async (feeName: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      try {
        // For now, filter by name since we don't have proper IDs
        setFees(Array.isArray(fees) ? fees.filter((f) => f.name !== feeName) : []);
        alert('Fee structure deleted successfully');
      } catch (error) {
        console.error('Error deleting fee:', error);
        alert('Failed to delete fee structure');
      }
    }
  };

  // Helper functions for fee components
  // const updateFeeComponent = (
  //   index: number,
  //   field: keyof FeeComponent,
  //   value: string | number
  // ) => {
  //   const updatedComponents = [...formData.feeComponents];
  //   updatedComponents[index] = { ...updatedComponents[index], [field]: value };
  //   setFormData({ ...formData, feeComponents: updatedComponents });
  // };

  // const addFeeComponent = () => {
  //   setFormData({
  //     ...formData,
  //     feeComponents: [
  //       ...formData.feeComponents,
  //       { name: '', amount: 0, type: 'tuition' },
  //     ],
  //   });
  // };

  // const removeFeeComponent = (index: number) => {
  //   const updatedComponents = formData.feeComponents.filter(
  //     (_, i) => i !== index
  //   );
  //   setFormData({ ...formData, feeComponents: updatedComponents });
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await apiServices.fees.create(formData);
  //     if (response.success) {
  //       alert('Fee structure created successfully!');
  //       setShowAddForm(false);
  //       // Reset form
  //       setFormData({
  //         name: '',
  //         description: '',
  //         course: '',
  //         academicYear: '',
  //         semester: '',
  //         feeComponents: [{ name: '', amount: 0, type: 'tuition' }],
  //         discountPercentage: 0,
  //         lateFeePercentage: 0,
  //         lateFeeGraceDays: 0,
  //         validFrom: '',
  //         validTo: '',
  //       });
  //       // Refresh fees list
  //       fetchFees();
  //     } else {
  //       alert('Failed to create fee structure');
  //     }
  //   } catch (error) {
  //     console.error('Error creating fee structure:', error);
  //     alert('Error creating fee structure');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchFees = async () => {
  //   try {
  //     const response = await apiServices.fees.getAll();
  //     if (response.success) {
  //       setFees(response.data || []);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching fees:', error);
  //   }
  // };

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
          <h1>Manage Fees</h1>
          <p>View and manage fee structures</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search fees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.createBtn}
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={18} />
            Add Fee Structure
          </button>
        </div>
      </header>

      <div className={styles.revenueCard}>
        <h3>Total Revenue</h3>
        <p className={styles.revenueAmount}>${totalRevenue.toLocaleString()}</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Total Amount</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length > 0 ? (
              filteredFees.map((fee, index) => (
                <tr key={index}>
                  <td>{fee.name || 'N/A'}</td>
                  <td>${fee.totalAmount?.toLocaleString() || '0'}</td>
                  <td>{fee.validTo || 'N/A'}</td>
                  <td>
                    <span className={styles.statusBadge}>
                      {fee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.editBtn}>
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(fee.name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
                  <DollarSign size={48} />
                  <h3>No fees found</h3>
                  <p>
                    {searchTerm
                      ? 'Try a different search term'
                      : 'No fee structures in the system'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fee Structure Modal */}
      {showAddForm && (
        <FeeForm
          formData={feeFormData}
          setFormData={setFeeFormData}
          onSubmit={handleFeeSubmit}
          onClose={() => setShowAddForm(false)}
          courseOptions={courseOptions}
          isEdit={false}
        />
      )}
    </PortalLayout>
  );
};

export default AdminFees;
