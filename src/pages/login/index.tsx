import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { getDashboardUrl } from "../../utils/routing";
import styles from "./login.module.css";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const routerInstance = router as any;
      const dashboardUrl = getDashboardUrl(user.role, user.id);
      routerInstance?.push(dashboardUrl);
    }
  }, [isAuthenticated, user, router]);

  const redirectBasedOnRole = (userRole: string, userId: string) => {
    const routerInstance = router as any;
    const dashboardUrl = getDashboardUrl(userRole as any, userId);
    routerInstance?.push(dashboardUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // User will be set by auth context, useEffect will handle redirect
        // Wait a bit for auth state to update
        setTimeout(() => {
          const authUser = (window as any).__authUser || user;
          if (authUser) {
            redirectBasedOnRole(authUser.role, authUser.id);
          }
        }, 100);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <div className={styles["login-icon"]}>🎓</div>
        <h2 className={styles["login-title"]}>Welcome Back</h2>
        <p className={styles["login-subtitle"]}>Sign in to your account</p>

        {error && (
          <div className={styles["error-message"]}>
            {error}
          </div>
        )}

        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Email Address</label>
            <input
              type="email"
              className={styles["form-input"]}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Password</label>
            <input
              type="password"
              className={styles["form-input"]}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" className={styles["forgot-link"]}>
              Forgot password?
            </a>
          </div>

          <button 
            type="submit" 
            className={styles["login-button"]}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles["signup-text"]}>
          Don't have an account?{" "}
          <Link href="/signup" className={styles["signup-link"]}>
            Start a free trial
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
