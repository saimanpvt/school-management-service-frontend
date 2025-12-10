import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { authApi } from '../../services/authApi';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import styles from './change-password.module.css';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Current password validation
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    // New password validation
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    } else if (formData.newPassword === formData.currentPassword) {
      newErrors.newPassword =
        'New password must be different from current password';
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call the API to change the password
      const response = await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        setSuccess('Password changed successfully!');

        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setErrors({
          general:
            response.message || 'Failed to change password. Please try again.',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error && 'response' in error
          ? (error as any).response?.data?.message
          : 'Failed to change password. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PasswordForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (success) {
      setSuccess('');
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (authLoading) {
    return (
      <div className={styles['password-container']}>
        <div className={styles['password-card']}>
          <div className={styles.loading}>
            <LoadingDots />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles['password-container']}>
      <div className={styles['password-card']}>
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <button
            onClick={() => router.back()}
            className={styles['back-button']}
          >
            <ArrowLeft size={20} className={styles['back-icon']} />
            Back
          </button>
        </div>

        <div className={styles['password-icon']}>🔒</div>
        <h2 className={styles['password-title']}>Change Password</h2>
        <p className={styles['password-subtitle']}>
          Enter your current password and choose a new one
        </p>

        <form className={styles['password-form']} onSubmit={handleSubmit}>
          {errors.general && (
            <div className={`${styles.alert} ${styles['alert-error']}`}>
              <AlertCircle className={styles.icon} size={18} />
              {errors.general}
            </div>
          )}

          {success && (
            <div className={`${styles.alert} ${styles['alert-success']}`}>
              <CheckCircle className={styles.icon} size={18} />
              {success}
            </div>
          )}

          {/* Current Password */}
          <div className={styles['form-group']}>
            <label htmlFor="currentPassword" className={styles['form-label']}>
              Current Password
            </label>
            <div className={styles['password-input-group']}>
              <input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                required
                className={`${styles['form-input']} ${
                  errors.currentPassword ? styles.error : ''
                }`}
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange('currentPassword', e.target.value)
                }
              />
              <button
                type="button"
                className={styles['password-toggle']}
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <div className={styles['error-text']}>
                {errors.currentPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className={styles['form-group']}>
            <label htmlFor="newPassword" className={styles['form-label']}>
              New Password
            </label>
            <div className={styles['password-input-group']}>
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                required
                className={`${styles['form-input']} ${
                  errors.newPassword ? styles.error : ''
                }`}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange('newPassword', e.target.value)
                }
              />
              <button
                type="button"
                className={styles['password-toggle']}
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <div className={styles['error-text']}>{errors.newPassword}</div>
            )}
            <div className={styles['password-help']}>
              Password must be at least 6 characters long
            </div>
          </div>

          {/* Confirm Password */}
          <div className={styles['form-group']}>
            <label htmlFor="confirmPassword" className={styles['form-label']}>
              Confirm New Password
            </label>
            <div className={styles['password-input-group']}>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                required
                className={`${styles['form-input']} ${
                  errors.confirmPassword ? styles.error : ''
                }`}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
              />
              <button
                type="button"
                className={styles['password-toggle']}
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className={styles['error-text']}>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles['password-button']}
          >
            {loading ? (
              <LoadingDots />
            ) : (
              <>
                <Lock className={styles.icon} size={18} />
                Change Password
              </>
            )}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles['cancel-link']}
            >
              Cancel and go back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
