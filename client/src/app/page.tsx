"use client";

import { useAuth } from "@/context/AuthContext";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitList } from "@/components/HabitList";
import { useHabits } from "@/hooks/useHabits";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import styles from "./page.module.scss";
import { ExerciseList } from "@/components/ExerciseList";

const Dashboard = () => {
  const { logout } = useAuth();
  const {
    habits,
    isLoading,
    error,
    deleteHabit,
    toggleHabit,
    refetch: refetchHabits,
  } = useHabits();

  return (
    <div className={styles.pageWrapper}>
      {" "}
      {/* Используем pageWrapper из styles */}
      <header className={styles.header}>
        <h1>Wellnest Dashboard</h1>
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </header>
      <p>Welcome! You are logged in.</p>
      <AddHabitForm onHabitAdded={refetchHabits} />
      <HabitList
        habits={habits}
        isLoading={isLoading}
        error={error}
        onDelete={deleteHabit}
        onToggle={toggleHabit}
      />
      <hr style={{ margin: "2rem 0" }} /> {/* Разделитель */}
      {/* --- НОВЫЙ БЛОК ДЛЯ УПРАВЛЕНИЯ УПРАЖНЕНИЯМИ --- */}
      <ExerciseList />
      {/* --- КОНЕЦ НОВОГО БЛОКА --- */}
    </div>
  );
};

const LoginPage = () => (
  <div className={styles.loginWrapper}>
    <h1>Welcome to Wellnest</h1>
    <p>Please log in to continue</p>
    <TelegramLoginButton />
  </div>
);

export default function Home() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.pageWrapper}>
      {token ? <Dashboard /> : <LoginPage />}
    </main>
  );
}
