import React from "react";
import styles from "./Login.module.css";

const Login = () => {
  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <div className={styles["login-icon"]}>🎓</div>
        <h2 className={styles["login-title"]}>Welcome Back</h2>
        <p className={styles["login-subtitle"]}>Sign in to your account</p>

        <form className={styles["login-form"]}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Email Address</label>
            <input
              type="email"
              className={styles["form-input"]}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Password</label>
            <input
              type="password"
              className={styles["form-input"]}
              placeholder="Enter your password"
            />
            <a href="#" className={styles["forgot-link"]}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className={styles["login-button"]}>
            Sign in
          </button>
        </form>

        <p className={styles["signup-text"]}>
          Don’t have an account?{" "}
          <a href="#" className={styles["signup-link"]}>
            Start a free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
