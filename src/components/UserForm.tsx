import React, { useState } from 'react';
import { Eye, EyeOff, Mail, X } from 'lucide-react';
import styles from '../pages/portal/admin/[id]/admin.module.css';

export interface UserFormData {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    role: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    profileImage?: string;
    userID: string;
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
    fixedRole?: string; // When set, role dropdown is disabled and shows this role
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
    fixedRole,
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


    // Custom validation for required student fields
    const [formError, setFormError] = useState("");
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        const missing = [];
        if (!formData.email) missing.push('Email');
        if (!formData.firstName) missing.push('First Name');
        if (!formData.lastName) missing.push('Last Name');
        if (!formData.role) missing.push('Role');
        if ((formData.role === '2' || formData.role === '3') && !formData.userID) missing.push('User ID');
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
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                disabled={!!fixedRole}
                                style={fixedRole ? { backgroundColor: '#f3f4f6', color: '#6b7280' } : {}}
                            >
                                <option value="">Select Role</option>
                                {roleOptions.map(role => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                            {fixedRole && (
                                <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                                    Role is automatically set based on the selected user type
                                </small>
                            )}
                        </div>
                        {/* User ID field: editable and required for teacher (role '2') and student (role '3'), readOnly for others */}
                        {(formData.role === '2' || formData.role === '3') ? (
                            <div className={styles.formGroup}>
                                <label>User ID *</label>
                                <input
                                    type="text"
                                    name="userID"
                                    value={formData.userID}
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
                                    name="userID"
                                    value={formData.userID}
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
