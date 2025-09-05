"use client";

import { useHabitStats, HabitStats } from "@/hooks/useHabitStats";
import styles from "./HabitStatsModal.module.scss";

interface HabitStatsModalProps {
  habitId: string;
  onClose: () => void;
}

const HabitStatsView = ({ stats }: { stats: HabitStats }) => (
  <div>
    <h2>{stats.habitTitle}</h2>
    <div className={styles.statsContainer}>
      <div className={styles.statBox}>
        <div className={styles.statValue}>{stats.totalCompletions}</div>
        <div className={styles.statLabel}>Всего</div>
      </div>
      <div className={styles.statBox}>
        <div className={styles.statValue}>🔥 {stats.currentStreak}</div>
        <div className={styles.statLabel}>Текущая серия</div>
      </div>
      <div className={styles.statBox}>
        <div className={styles.statValue}>🏆 {stats.longestStreak}</div>
        <div className={styles.statLabel}>Лучшая серия</div>
      </div>
    </div>
    <h4>История выполнений:</h4>
    <pre>{JSON.stringify(stats.completionHistory, null, 2)}</pre>
  </div>
);

export const HabitStatsModal = ({ habitId, onClose }: HabitStatsModalProps) => {
  const { stats, isLoading, error } = useHabitStats(habitId);

  const renderContent = () => {
    if (isLoading) return <p>Загрузка статистики...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (stats) return <HabitStatsView stats={stats} />;
    return null;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};
