"use client";

import { useAuth } from "@/context/AuthContext";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitList } from "@/components/HabitList";
import { useHabits } from "@/hooks/useHabits";
import TelegramLoginButton from "@/components/TelegramLoginButton";
import styles from "./page.module.scss";

const Dashboard = () => {
  const { logout } = useAuth();
  const { habits, isLoading, error, deleteHabit, toggleHabit, refetch } =
    useHabits();

  return (
    <div>
      <header className={styles.header}>
        <h1>Wellnest Dashboard</h1>
        <button onClick={logout} className={styles.logoutButton}>
          Log Out
        </button>
      </header>
      <p>Welcome! You are logged in.</p>

      <AddHabitForm onHabitAdded={refetch} />

      <HabitList
        habits={habits}
        isLoading={isLoading}
        error={error}
        onDelete={deleteHabit}
        onToggle={toggleHabit}
      />
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
