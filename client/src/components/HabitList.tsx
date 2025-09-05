"use client";

import { useState } from "react";
import { useHabits, Habit } from "@/hooks/useHabits";
import { HabitStatsModal } from "./HabitStatsModal";
import styles from "./HabitList.module.scss";

const HabitItem = ({
  habit,
  onToggle,
  onDelete,
  onSelect,
}: {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onSelect: (habitId: string) => void;
}) => (
  <li className={styles.item}>
    <input
      type="checkbox"
      checked={habit.isCompletedToday}
      onChange={() => onToggle(habit)}
      className={styles.checkbox}
    />
    <div
      onClick={() => onSelect(habit.id)}
      className={`${styles.content} ${
        habit.isCompletedToday ? styles.completed : ""
      }`}
    >
      <span>{habit.title}</span>
      <span className={styles.streak}>🔥 {habit.streak}</span>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(habit.id);
      }}
      className={styles.deleteButton}
    >
      &times;
    </button>
  </li>
);

export const HabitList = () => {
  const { habits, isLoading, error, deleteHabit, toggleHabit } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  if (isLoading) return <p>Loading habits...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {selectedHabitId && (
        <HabitStatsModal
          habitId={selectedHabitId}
          onClose={() => setSelectedHabitId(null)}
        />
      )}
      <h3>My Habits List</h3>
      {habits.length === 0 ? (
        <p>You have no habits yet. Add one!</p>
      ) : (
        <ul className={styles.list}>
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
              onSelect={setSelectedHabitId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
