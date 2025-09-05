"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { HabitCalendar } from "./HabitCalendar"; // <-- 1. Импортируем компонент календаря
import styles from "./HabitStatsModal.module.scss";

// Тип для данных, которые мы ожидаем от API /habits/:id/stats
interface HabitStats {
  habitTitle: string;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionHistory: string[]; // Массив дат в формате 'YYYY-MM-DD'
}

// Тип для пропсов, которые принимает наш компонент
interface HabitStatsModalProps {
  habitId: string;
  onClose: () => void; // Функция, которая будет вызвана для закрытия окна
}

// Компонент, который просто отображает статистику
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
    {/* --- ИЗМЕНЕНИЕ: Вставляем компонент календаря --- */}
    <h4>Календарь выполнений:</h4>
    <HabitCalendar completionHistory={stats.completionHistory} />
    {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
  </div>
);

export const HabitStatsModal = ({ habitId, onClose }: HabitStatsModalProps) => {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      if (!habitId) return;
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get<HabitStats>(`/habits/${habitId}/stats`);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load stats.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [habitId]);

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
