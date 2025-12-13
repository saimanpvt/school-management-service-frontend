import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../lib/auth';
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import LoadingDots from '../../../components/LoadingDots/LoadingDots';
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
      <div className={styles['profile-container']}>
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles['profile-container']}>
        <div className={styles.error}>
          <h2>Profile not found</h2>
          <button
            onClick={() => router.back()}
            className={styles['action-button']}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['modern-profile']}>
      {/* Hero Banner Section */}
      <div className={styles['hero-banner']}>
        <div className={styles['banner-overlay']}>
          <div className={styles['banner-content']}>
            <button
              onClick={() => router.back()}
              className={styles['back-button']}
            >
              <ArrowLeft size={20} className={styles['back-icon']} />
              Back to Dashboard
            </button>

            <div className={styles['profile-hero']}>
              <div className={styles['hero-avatar']}>
                {profile.firstName.charAt(0).toUpperCase()}
                {profile.lastName.charAt(0).toUpperCase()}
              </div>

              <div className={styles['hero-info']}>
                <h1 className={styles['hero-name']}>
                  {profile.firstName} {profile.lastName}
                </h1>
                <div className={styles['hero-meta']}>
                  <span
                    className={`${styles['hero-role']} ${getRoleClass(
                      profile.role
                    )}`}
                  >
                    {profile.role}
                  </span>
                  <span className={styles['hero-id']}>
                    ID: {profile.userID}
                  </span>
                  <span className={styles['hero-email']}>{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles['main-content']}>
        <div className={styles['content-wrapper']}>
          {/* Quick Actions Strip */}
          <div className={styles['actions-strip']}>
            <button
              onClick={() => router.push('/portal/change-password')}
              className={styles['action-btn']}
            >
              Change Password
            </button>
          </div>

          {/* Information Grid */}
          <div className={styles['info-grid']}>
            {/* Basic Information */}
            <div className={styles['info-section']}>
              <h3 className={styles['section-title']}>Basic Information</h3>

              <div className={styles['info-list']}>
                <div className={styles['info-row']}>
                  <User className={styles['row-icon']} size={18} />
                  <div className={styles['row-content']}>
                    <span className={styles['row-label']}>Full Name</span>
                    <span className={styles['row-value']}>
                      {profile.firstName} {profile.lastName}
                    </span>
                  </div>
                </div>

                <div className={styles['info-row']}>
                  <Mail className={styles['row-icon']} size={18} />
                  <div className={styles['row-content']}>
                    <span className={styles['row-label']}>Email</span>
                    <span className={styles['row-value']}>{profile.email}</span>
                  </div>
                </div>

                <div className={styles['info-row']}>
                  <div className={styles['row-icon']}>ID</div>
                  <div className={styles['row-content']}>
                    <span className={styles['row-label']}>User ID</span>
                    <span className={styles['row-value']}>
                      {profile.userID}
                    </span>
                  </div>
                </div>

                {profile.phone && (
                  <div className={styles['info-row']}>
                    <Phone className={styles['row-icon']} size={18} />
                    <div className={styles['row-content']}>
                      <span className={styles['row-label']}>Phone</span>
                      <span className={styles['row-value']}>
                        {profile.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className={styles['info-section']}>
              <h3 className={styles['section-title']}>
                Additional Information
              </h3>

              <div className={styles['info-list']}>
                {profile.dob && (
                  <div className={styles['info-row']}>
                    <Calendar className={styles['row-icon']} size={18} />
                    <div className={styles['row-content']}>
                      <span className={styles['row-label']}>Date of Birth</span>
                      <span className={styles['row-value']}>{profile.dob}</span>
                    </div>
                  </div>
                )}

                {profile.gender && (
                  <div className={styles['info-row']}>
                    <User className={styles['row-icon']} size={18} />
                    <div className={styles['row-content']}>
                      <span className={styles['row-label']}>Gender</span>
                      <span className={styles['row-value']}>
                        {profile.gender}
                      </span>
                    </div>
                  </div>
                )}

                {profile.bloodGroup && (
                  <div className={styles['info-row']}>
                    <div className={styles['row-icon']}>B+</div>
                    <div className={styles['row-content']}>
                      <span className={styles['row-label']}>Blood Group</span>
                      <span className={styles['row-value']}>
                        {profile.bloodGroup}
                      </span>
                    </div>
                  </div>
                )}

                {profile.address &&
                  (profile.address.street || profile.address.city) && (
                    <div className={styles['info-row']}>
                      <MapPin className={styles['row-icon']} size={18} />
                      <div className={styles['row-content']}>
                        <span className={styles['row-label']}>Address</span>
                        <div className={styles['row-value']}>
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

                {!profile.dob &&
                  !profile.gender &&
                  !profile.bloodGroup &&
                  (!profile.address ||
                    (!profile.address.street && !profile.address.city)) && (
                    <div className={styles['empty-state']}>
                      No additional information available
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
