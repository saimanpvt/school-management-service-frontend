import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import styles from './settings.module.css';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  userID: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

const Settings = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      // Set user profile from auth context
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        userID: user.userID || user.id || '',
        dob: user.dob || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        address: user.address || {},
      });
      setLoading(false);
    }
  }, [user, authLoading, router]);

  const getRoleClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return styles['role-admin'];
      case 'teacher':
        return styles['role-teacher'];
      case 'student':
        return styles['role-student'];
      case 'parent':
        return styles['role-parent'];
      default:
        return styles['role-student'];
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles['settings-container']}>
        <div className={styles['settings-card']}>
          <div className={styles.loading}>
            <LoadingDots />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles['settings-container']}>
        <div className={styles['settings-card']}>
          <div className={styles.error}>
            <h2>Profile not found</h2>
            <button
              onClick={() => router.back()}
              className={styles['secondary-button']}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['settings-container']}>
      <div className={styles['settings-card']}>
        {/* Header */}
        <div className={styles['settings-header']}>
          <button
            onClick={() => router.back()}
            className={styles['back-button']}
          >
            <ArrowLeft size={20} className={styles['back-icon']} />
            Back
          </button>

          <div className={styles['settings-icon']}>⚙️</div>
          <h1 className={styles['settings-title']}>Settings</h1>
          <p className={styles['settings-subtitle']}>
            Manage your profile information
          </p>
        </div>

        {/* Profile Header */}
        <div className={styles['profile-header']}>
          <div className={styles.avatar}>
            {profile.firstName.charAt(0).toUpperCase()}
            {profile.lastName.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles['profile-name']}>
            {profile.firstName} {profile.lastName}
          </h2>
          <span
            className={`${styles['role-badge']} ${getRoleClass(profile.role)}`}
          >
            {profile.role}
          </span>
        </div>

        {/* Profile Details */}
        <div className={styles['profile-content']}>
          {/* Basic Information */}
          <div className={styles['info-section']}>
            <h3 className={styles['section-title']}>Basic Information</h3>

            <div className={styles['info-item']}>
              <User className={styles['info-icon']} size={18} />
              <div className={styles['info-content']}>
                <div className={styles.label}>Full Name</div>
                <div className={styles.value}>
                  {profile.firstName} {profile.lastName}
                </div>
              </div>
            </div>

            <div className={styles['info-item']}>
              <Mail className={styles['info-icon']} size={18} />
              <div className={styles['info-content']}>
                <div className={styles.label}>Email</div>
                <div className={styles.value}>{profile.email}</div>
              </div>
            </div>

            <div className={styles['info-item']}>
              <div
                className={styles['info-icon']}
                style={{ fontSize: '12px', fontWeight: 'bold' }}
              >
                ID
              </div>
              <div className={styles['info-content']}>
                <div className={styles.label}>User ID</div>
                <div className={styles.value}>{profile.userID}</div>
              </div>
            </div>

            {profile.phone && (
              <div className={styles['info-item']}>
                <Phone className={styles['info-icon']} size={18} />
                <div className={styles['info-content']}>
                  <div className={styles.label}>Phone</div>
                  <div className={styles.value}>{profile.phone}</div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className={styles['info-section']}>
            <h3 className={styles['section-title']}>Additional Information</h3>

            {profile.dob && (
              <div className={styles['info-item']}>
                <Calendar className={styles['info-icon']} size={18} />
                <div className={styles['info-content']}>
                  <div className={styles.label}>Date of Birth</div>
                  <div className={styles.value}>{profile.dob}</div>
                </div>
              </div>
            )}

            {profile.gender && (
              <div className={styles['info-item']}>
                <User className={styles['info-icon']} size={18} />
                <div className={styles['info-content']}>
                  <div className={styles.label}>Gender</div>
                  <div className={styles.value}>{profile.gender}</div>
                </div>
              </div>
            )}

            {profile.bloodGroup && (
              <div className={styles['info-item']}>
                <div
                  className={styles['info-icon']}
                  style={{ fontSize: '12px', fontWeight: 'bold' }}
                >
                  B+
                </div>
                <div className={styles['info-content']}>
                  <div className={styles.label}>Blood Group</div>
                  <div className={styles.value}>{profile.bloodGroup}</div>
                </div>
              </div>
            )}

            {profile.address &&
              (profile.address.street || profile.address.city) && (
                <div className={styles['info-item']}>
                  <MapPin className={styles['info-icon']} size={18} />
                  <div className={styles['info-content']}>
                    <div className={styles.label}>Address</div>
                    <div
                      className={`${styles.value} ${styles['address-value']}`}
                    >
                      {profile.address.street && (
                        <div>{profile.address.street}</div>
                      )}
                      {(profile.address.city || profile.address.state) && (
                        <div>
                          {profile.address.city}
                          {profile.address.city &&
                            profile.address.state &&
                            ', '}
                          {profile.address.state} {profile.address.zipCode}
                        </div>
                      )}
                      {profile.address.country && (
                        <div>{profile.address.country}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Show message if no additional info */}
            {!profile.dob &&
              !profile.gender &&
              !profile.bloodGroup &&
              (!profile.address ||
                (!profile.address.street && !profile.address.city)) && (
                <div className={styles['info-item']}>
                  <div className={styles['info-content']}>
                    <div
                      className={styles.value}
                      style={{ color: '#666', fontStyle: 'italic' }}
                    >
                      No additional information available
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            onClick={() => router.push('/change-password')}
            className={styles['primary-button']}
          >
            Change Password
          </button>
          <button
            onClick={() => router.back()}
            className={styles['secondary-button']}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
