import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '../../services/authApi';
import Link from 'next/link';
import styles from './signup.module.css';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import { getDashboardUrl } from '../../lib/utils/routing';

// No role mapping needed - send role names directly

export default function SignupPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<
    'admin' | 'teacher' | 'student' | 'parent'
  >('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        firstName: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
      });

      if (response.success) {
        // Store the token
        localStorage.setItem('token', response.data.token);

        // Redirect to the appropriate dashboard using UUID
        const { role, uuid } = response.data.user;
        const dashboardUrl = getDashboardUrl(role, uuid);
        await router.push(dashboardUrl);
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['signup-container']}>
      <div className={styles['signup-card']}>
        <div className={styles['signup-header']}>
          <h1 className={styles['signup-title']}>Create your account</h1>
          <p className={styles['signup-subtitle']}>Join EduConnect community</p>
        </div>

        {error && <div className={styles['error-message']}>{error}</div>}

        <form className={styles['signup-form']} onSubmit={handleSubmit}>
          {loading && <LoadingDots />}
          <div className={styles['form-group']}>
            <label className={styles['form-label']}>I am a</label>
            <div className={styles['user-type-toggle']}>
              <button
                type="button"
                className={`${styles['toggle-btn']} ${userType === 'admin' ? styles['active'] : ''
                  }`}
                onClick={() => setUserType('admin')}
              >
                Admin
              </button>
              <button
                type="button"
                className={`${styles['toggle-btn']} ${userType === 'teacher' ? styles['active'] : ''
                  }`}
                onClick={() => setUserType('teacher')}
              >
                Teacher
              </button>
              <button
                type="button"
                className={`${styles['toggle-btn']} ${userType === 'student' ? styles['active'] : ''
                  }`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
              <button
                type="button"
                className={`${styles['toggle-btn']} ${userType === 'parent' ? styles['active'] : ''
                  }`}
                onClick={() => setUserType('parent')}
              >
                Parent
              </button>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Full Name</label>
            <input
              type="text"
              className={styles['form-input']}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Email Address</label>
            <input
              type="email"
              className={styles['form-input']}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Password</label>
            <input
              type="password"
              className={styles['form-input']}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Confirm Password</label>
            <input
              type="password"
              className={styles['form-input']}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={styles['btn-signup']}
            disabled={loading}
          >
            {loading ? <LoadingDots /> : 'Sign Up'}
          </button>

          <div className={styles['signup-footer']}>
            <span className={styles['footer-text']}>
              Already have an account?{' '}
            </span>
            <Link href="/login" className={styles['footer-link']}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
