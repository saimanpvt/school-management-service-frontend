import React, { useState } from 'react';
import styles from './signup.module.css';

export default function SignupPage() {
  const [userType, setUserType] = useState('student');

  return (
    <div className={styles["signup-container"]}>
      <div className={styles["signup-card"]}>
        <div className={styles["signup-header"]}>
          <h1 className={styles["signup-title"]}>Create your account</h1>
          <p className={styles["signup-subtitle"]}>Join EduConnect community</p>
        </div>

        <form className={styles["signup-form"]}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>I am a</label>
            <div className={styles["user-type-toggle"]}>
              <button
                type="button"
                className={`${styles["toggle-btn"]} ${userType === 'teacher' ? styles["active"] : ''}`}
                onClick={() => setUserType('teacher')}
              >
                Teacher
              </button>
              <button
                type="button"
                className={`${styles["toggle-btn"]} ${userType === 'student' ? styles["active"] : ''}`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Parent</label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="***"
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Full Name</label>
            <input
              type="text"
              className={styles["form-input"]}
              placeholder=""
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Email Address</label>
            <input
              type="email"
              className={styles["form-input"]}
              placeholder=""
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Password</label>
            <input
              type="password"
              className={styles["form-input"]}
              placeholder=""
            />
          </div>

          <button type="submit" className={styles["btn-signup"]}>
            Sign Up
          </button>

          <div className={styles["signup-footer"]}>
            <span className={styles["footer-text"]}>Already have an account? </span>
            <a href="#" className={styles["footer-link"]}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}