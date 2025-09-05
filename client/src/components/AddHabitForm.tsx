"use client";

import { useAddHabit } from "@/hooks/useAddHabit";
import styles from "./AddHabitForm.module.scss";

interface AddHabitFormProps {
  onHabitAdded: () => void;
}

export const AddHabitForm = ({ onHabitAdded }: AddHabitFormProps) => {
  const { title, setTitle, isSubmitting, handleSubmit } =
    useAddHabit(onHabitAdded);

  return (
    <div>
      <h3>Add a New Habit</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Drink water"
          disabled={isSubmitting}
          className={styles.input}
        />
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
};
