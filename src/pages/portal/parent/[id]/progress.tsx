import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { BarChart2, TrendingUp, Award } from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { apiServices } from '../../../../services/api';
import { PARENT_FILTER_OPTIONS } from '../../../../lib/constants';
import {
  ParentChild,
  ParentProgress as ParentProgressType,
} from '../../../../lib/types';

const ParentProgress = () => {
  const router = useRouter();
  const { id } = router.query;
  const [progress, setProgress] = useState<ParentProgressType[]>([]);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>(
    PARENT_FILTER_OPTIONS.ALL_CHILDREN
  );
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadProgressData = async () => {
      if (id) {
        try {
          setLoading(true);

          // Load children data
          const childrenResponse = await apiServices.parent?.getChildren(
            id as string
          );
          if (childrenResponse?.success && childrenResponse.data) {
            setChildren(childrenResponse.data);
          }

          // Load progress data
          const progressResponse = await apiServices.parent?.getProgress(
            id as string
          );
          if (progressResponse?.success && progressResponse.data) {
            setProgress(progressResponse.data);
          } else {
            setProgress([]);
            addNotification({
              type: 'info',
              title: 'No progress data found',
              message: 'Academic progress will appear here once available.',
            });
          }
        } catch (error) {
          console.error('Error loading progress data:', error);
          addNotification({
            type: 'error',
            title: 'Failed to load progress data',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadProgressData();
  }, [id, addNotification]);

  const filteredProgress =
    selectedChild === PARENT_FILTER_OPTIONS.ALL_CHILDREN
      ? progress
      : progress.filter((p) => p.childId === selectedChild);

  const calculateOverallAverage = () => {
    if (filteredProgress.length === 0) return 0;
    const sum = filteredProgress.reduce((acc, p) => acc + p.currentGrade, 0);
    return (sum / filteredProgress.length).toFixed(1);
  };

  if (loading) {
    return (
      <PortalLayout userName="Parent" userRole="parent">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Parent" userRole="parent">
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Children&apos;s Progress</h1>
            <p>Monitor your children&apos;s academic performance</p>
          </div>
          {children.length > 1 && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className={styles.childSelect}
            >
              <option value={PARENT_FILTER_OPTIONS.ALL_CHILDREN}>
                All Children
              </option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          )}
        </header>

        {filteredProgress.length > 0 && (
          <div className={styles.overallStats}>
            <div className={styles.overallCard}>
              <Award size={24} />
              <div>
                <h3>Overall Average</h3>
                <p className={styles.overallGrade}>
                  {calculateOverallAverage()}%
                </p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.progressContainer}>
          {filteredProgress.length > 0 ? (
            filteredProgress.map((item, idx) => (
              <div
                key={`${item.childId}-${item.courseId}-${idx}`}
                className={styles.progressCard}
              >
                <div className={styles.progressHeader}>
                  <div>
                    <h3>{item.courseName}</h3>
                    <span className={styles.childName}>{item.childName}</span>
                  </div>
                  <div className={styles.gradeSection}>
                    <div className={styles.currentGrade}>
                      {item.currentGrade}%
                    </div>
                    <div
                      className={`${styles.trendIndicator} ${
                        styles[item.trend]
                      }`}
                    >
                      {item.trend === 'up' && <TrendingUp size={16} />}
                      {item.trend === 'down' && (
                        <TrendingUp
                          size={16}
                          style={{ transform: 'rotate(180deg)' }}
                        />
                      )}
                      {item.previousGrade !== item.currentGrade && (
                        <span>
                          {item.trend === 'up' ? '+' : ''}
                          {(item.currentGrade - item.previousGrade).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${item.currentGrade}%` }}
                  />
                </div>

                {item.assignments.length > 0 && (
                  <div className={styles.assignmentsSection}>
                    <h4>Assignments</h4>
                    <div className={styles.gradeList}>
                      {item.assignments.map((assignment, aIdx) => (
                        <div key={aIdx} className={styles.gradeItem}>
                          <span>{assignment.title}</span>
                          <span className={styles.gradeValue}>
                            {assignment.grade} / {assignment.maxGrade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.tests.length > 0 && (
                  <div className={styles.testsSection}>
                    <h4>Tests</h4>
                    <div className={styles.gradeList}>
                      {item.tests.map((test, tIdx) => (
                        <div key={tIdx} className={styles.gradeItem}>
                          <span>{test.title}</span>
                          <span className={styles.gradeValue}>
                            {test.grade} / {test.maxGrade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <BarChart2 size={48} />
              <h3>No progress data</h3>
              <p>Progress information will appear here</p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentProgress;
