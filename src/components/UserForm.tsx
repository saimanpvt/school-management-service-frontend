import React, { useState } from 'react';
import { Eye, EyeOff, Mail, X } from 'lucide-react';
import styles from '../pages/portal/admin/[id]/admin.module.css';

export interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phone: string;
    userId: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    dob: string;
    gender: string;
    bloodGroup: string;
    // Role-specific fields
    parentId?: string;
    subject?: string;
    qualification?: string;
    experience?: string;
    // Teacher-specific
    employeeId?: string;
    DOJ?: string;
    resignationDate?: string;
    bio?: string;
    emergencyContact?: string;
    department?: string;
    // Student-specific
    studentId?: string;
    classId?: string;
    admissionDate?: string;
    leavingDate?: string;
    classTeacher?: string;
    course?: string;
}

interface UserFormProps {
    formData: UserFormData;
    setFormData: (data: UserFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    generatedPassword: string;
    setGeneratedPassword: (pw: string) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    roleOptions: { value: string; label: string; color: string }[];
    genderOptions: string[];
    bloodGroupOptions: string[];
    parentOptions?: { value: string; label: string }[];
    isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
    formData,
    setFormData,
    onSubmit,
    onClose,
    generatedPassword,
    setGeneratedPassword,
    showPassword,
    setShowPassword,
    roleOptions,
    genderOptions,
    bloodGroupOptions,
    // parentOptions removed (no longer needed for text input)
    // teacherOptions removed
    isEdit = false,
}) => {
    // Password generator
    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setGeneratedPassword(password);
        return password;
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };
    // Handle textarea changes (for bio)
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Custom validation for required student fields
    const [formError, setFormError] = useState("");
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        if (formData.role === '3') {
            const missing = [];
            if (!formData.userId) missing.push('User ID');
            if (!formData.parentId) missing.push('Parent');
            if (!formData.dob) missing.push('Date of Birth');
            if (missing.length > 0) {
                setFormError('Please fill all required fields: ' + missing.join(', '));
                return;
            }
        }
        onSubmit(e);
    };
    return (
        <div className={styles.formOverlay}>
            <div className={`${styles.formContainer} ${styles.largeForm}`}>
                <div className={styles.formHeader}>
                    <h2>{isEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                {formError && <div style={{ color: 'red', marginBottom: 8 }}>{formError}</div>}
                <form onSubmit={handleFormSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>First Name *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Last Name *</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Role *</label>
                            <select name="role" value={formData.role} onChange={handleInputChange} required>
                                <option value="">Select Role</option>
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* User ID field: editable and required for teacher (role '2') and student (role '3'), readOnly for others */}
                        {(formData.role === '2' || formData.role === '3') ? (
                            <div className={styles.formGroup}>
                                <label>User ID *</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter User ID"
                                />
                            </div>
                        ) : (
                            <div className={styles.formGroup}>
                                <label>User ID</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleInputChange}
                                    placeholder="Auto-generated"
                                    readOnly
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="">Select Gender</option>
                                {genderOptions.map(gender => (
                                    <option key={gender} value={gender}>{gender}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                                <option value="">Select Blood Group</option>
                                {bloodGroupOptions.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.addressSection}>
                        <h3>Address Information</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Street</label>
                                <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>City</label>
                                <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>State</label>
                                <input type="text" name="address.state" value={formData.address.state} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Zip Code</label>
                                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Country</label>
                            <input type="text" name="address.country" value={formData.address.country} onChange={handleInputChange} />
                        </div>
                    </div>
                    {/* Student-specific fields */}
                    {formData.role === '3' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Parent *</label>
                                <input
                                    type="text"
                                    name="parentId"
                                    value={formData.parentId || ''}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter Parent ID"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Student ID *</label>
                                <input type="text" name="studentId" value={formData.studentId || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Class ID *</label>
                                <input type="text" name="classId" value={formData.classId || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Class Teacher *</label>
                                <input type="text" name="classTeacher" value={formData.classTeacher || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Course *</label>
                                <input type="text" name="course" value={formData.course || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Birth *</label>
                                <input type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Admission Date</label>
                                <input type="date" name="admissionDate" value={formData.admissionDate || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Leaving Date</label>
                                <input type="date" name="leavingDate" value={formData.leavingDate || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Emergency Contact</label>
                                <input type="tel" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleInputChange} />
                            </div>
                        </>
                    )}
                    {/* Teacher-specific fields */}
                    {formData.role === '2' && (
                        <>
                            <div className={styles.formGroup}>
                                <label>Employee ID *</label>
                                <input type="text" name="employeeId" value={formData.employeeId || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Date of Joining *</label>
                                <input type="date" name="DOJ" value={formData.DOJ || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Resignation Date</label>
                                <input type="date" name="resignationDate" value={formData.resignationDate || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Department *</label>
                                <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Bio</label>
                                <textarea name="bio" value={formData.bio || ''} onChange={handleTextAreaChange} maxLength={500} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Emergency Contact</label>
                                <input type="tel" name="emergencyContact" value={formData.emergencyContact || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Subject</label>
                                <input type="text" name="subject" value={formData.subject || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Qualification</label>
                                <input type="text" name="qualification" value={formData.qualification || ''} onChange={handleInputChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Experience (months)</label>
                                <input type="number" name="experience" value={formData.experience || ''} onChange={handleInputChange} min="0" />
                            </div>
                        </>
                    )}
                    <div className={styles.passwordSection}>
                        <h3>Password Generation</h3>
                        <div className={styles.passwordGenerator}>
                            <div className={styles.passwordField}>
                                <input type={showPassword ? "text" : "password"} value={generatedPassword} placeholder="Click generate to create password" readOnly />
                                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <button type="button" className={styles.generatePasswordBtn} onClick={generatePassword}>
                                Generate Password
                            </button>
                        </div>
                        <p className={styles.passwordNote}>
                            <Mail size={16} /> Password will be sent to user&apos;s email automatically
                        </p>
                    </div>
                    <button type="submit" className={styles.submitButton} disabled={!generatedPassword}>
                        {isEdit ? 'Update User' : 'Create User & Send Credentials'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
