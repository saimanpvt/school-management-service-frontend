import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices } from '../../../../services/api';
import { DollarSign, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface FeeStructureFormData {
    name: string;
    description: string;
    course: string;
    academicYear: string;
    semester: string;
    feeComponents: FeeComponent[];
    discountPercentage: number;
    lateFeePercentage: number;
    lateFeeGraceDays: number;
    validFrom: string;
    validTo: string;
}

interface FeeComponent {
    name: string;
    amount: number;
    type: string;
}

const AdminFees = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState<FeeStructureFormData>({
        name: '',
        description: '',
        course: '',
        academicYear: '',
        semester: '',
        feeComponents: [{ name: '', amount: 0, type: 'tuition' }],
        discountPercentage: 0,
        lateFeePercentage: 0,
        lateFeeGraceDays: 0,
        validFrom: '',
        validTo: ''
    });

    useEffect(() => {
        if (id) {
            apiServices.fees.getAll()
                .then(response => {
                    if (response.success) {
                        setFees(response.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching fees:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const filteredFees = fees.filter(fee =>
        fee.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = filteredFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

    const handleDelete = async (feeId: string) => {
        if (confirm('Are you sure you want to delete this fee structure?')) {
            try {
                await apiServices.fees.delete(feeId);
                setFees(fees.filter(f => f.id !== feeId));
            } catch (error) {
                console.error('Error deleting fee:', error);
                alert('Failed to delete fee structure');
            }
        }
    };

    // Helper functions for fee components
    const updateFeeComponent = (index: number, field: keyof FeeComponent, value: string | number) => {
        const updatedComponents = [...formData.feeComponents];
        updatedComponents[index] = { ...updatedComponents[index], [field]: value };
        setFormData({ ...formData, feeComponents: updatedComponents });
    };

    const addFeeComponent = () => {
        setFormData({
            ...formData,
            feeComponents: [...formData.feeComponents, { name: '', amount: 0, type: 'tuition' }]
        });
    };

    const removeFeeComponent = (index: number) => {
        const updatedComponents = formData.feeComponents.filter((_, i) => i !== index);
        setFormData({ ...formData, feeComponents: updatedComponents });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiServices.admin.addFeeStructure(formData);
            if (response.success) {
                alert('Fee structure created successfully!');
                setShowAddForm(false);
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    course: '',
                    academicYear: '',
                    semester: '',
                    feeComponents: [{ name: '', amount: 0, type: 'tuition' }],
                    discountPercentage: 0,
                    lateFeePercentage: 0,
                    lateFeeGraceDays: 0,
                    validFrom: '',
                    validTo: ''
                });
                // Refresh fees list
                fetchFees();
            } else {
                alert('Failed to create fee structure');
            }
        } catch (error) {
            console.error('Error creating fee structure:', error);
            alert('Error creating fee structure');
        } finally {
            setLoading(false);
        }
    };

    const fetchFees = async () => {
        try {
            const response = await apiServices.fees.getAll();
            if (response.success) {
                setFees(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching fees:', error);
        }
    };

    if (loading) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.loading}><LoadingDots /></div>
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
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFees.length > 0 ? (
                            filteredFees.map(fee => (
                                <tr key={fee.id}>
                                    <td>{fee.title || 'N/A'}</td>
                                    <td>${fee.amount?.toLocaleString() || '0'}</td>
                                    <td>{fee.dueDate || 'N/A'}</td>
                                    <td>
                                        <span className={styles.statusBadge}>
                                            {fee.status || 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.editBtn}>
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(fee.id)}
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
                                    <p>{searchTerm ? 'Try a different search term' : 'No fee structures in the system'}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Fee Structure Modal */}
            {showAddForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Add Fee Structure</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowAddForm(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Fee Structure Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter fee structure name"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Course *</label>
                                        <input
                                            type="text"
                                            value={formData.course}
                                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                            placeholder="Enter course"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Academic Year *</label>
                                        <input
                                            type="text"
                                            value={formData.academicYear}
                                            onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                            placeholder="2023-2024"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Semester *</label>
                                        <select
                                            value={formData.semester}
                                            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Semester</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                            <option value="8">Semester 8</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Valid From *</label>
                                        <input
                                            type="date"
                                            value={formData.validFrom}
                                            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Valid To *</label>
                                        <input
                                            type="date"
                                            value={formData.validTo}
                                            onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Discount Percentage (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Late Fee Percentage (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.lateFeePercentage}
                                            onChange={(e) => setFormData({ ...formData, lateFeePercentage: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Late Fee Grace Days</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.lateFeeGraceDays}
                                            onChange={(e) => setFormData({ ...formData, lateFeeGraceDays: Number(e.target.value) })}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Enter fee structure description"
                                        rows={3}
                                    />
                                </div>

                                {/* Fee Components Section */}
                                <div className={styles.feeComponentsSection}>
                                    <h3>Fee Components</h3>
                                    {formData.feeComponents.map((component, index) => (
                                        <div key={index} className={styles.componentRow}>
                                            <input
                                                type="text"
                                                placeholder="Component name (e.g., Tuition Fee)"
                                                value={component.name}
                                                onChange={(e) => updateFeeComponent(index, 'name', e.target.value)}
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={component.amount}
                                                onChange={(e) => updateFeeComponent(index, 'amount', Number(e.target.value))}
                                                required
                                            />
                                            <select
                                                value={component.type}
                                                onChange={(e) => updateFeeComponent(index, 'type', e.target.value)}
                                                required
                                            >
                                                <option value="tuition">Tuition</option>
                                                <option value="library">Library</option>
                                                <option value="lab">Laboratory</option>
                                                <option value="sports">Sports</option>
                                                <option value="transport">Transport</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {formData.feeComponents.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeeComponent(index)}
                                                    className={styles.removeComponentBtn}
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addFeeComponent}
                                        className={styles.addComponentBtn}
                                    >
                                        <Plus size={16} />
                                        Add Component
                                    </button>
                                </div>

                                <div className={styles.modalActions}>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.createBtn}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Fee Structure'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
};

export default AdminFees;

