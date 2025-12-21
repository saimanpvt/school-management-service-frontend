import React from 'react';
import styles from './LoadingDots.module.css';

interface LoadingDotsProps {
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.loadingContainer} ${className}`}>
      <div className={styles.loadingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default LoadingDots;
