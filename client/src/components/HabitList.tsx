"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

interface Habit {
  id: string;
  title: string;
}

export const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHabits = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get("/habits");
      setHabits(response.data);
    } catch (err) {
      setError("Failed to load habits.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  const handleDelete = async (habitId: string) => {
    // Оптимистичное обновление: сразу убираем из списка для лучшего UX
    setHabits((currentHabits) => currentHabits.filter((h) => h.id !== habitId));

    try {
      await api.delete(`/habits/${habitId}`);
    } catch (error) {
      console.error("Failed to delete habit", error);
      // Если на сервере произошла ошибка, откатываем изменение (возвращаем привычку в список)
      alert("Could not delete habit. Please refresh the page.");
      fetchHabits(); // Перезагружаем список, чтобы восстановить консистентность
    }
  };
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  if (isLoading) return <p>Loading habits...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>My Habits List</h3>
      {habits.length === 0 ? (
        <p>You have no habits yet. Add one!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {habits.map((habit) => (
            // --- НАЧАЛО ИЗМЕНЕНИЙ ---
            <li
              key={habit.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <span>{habit.title}</span>
              <button
                onClick={() => handleDelete(habit.id)}
                style={{
                  color: "red",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </li>
            // --- КОНЕЦ ИЗМЕНЕНИЙ ---
          ))}
        </ul>
      )}
    </div>
  );
};
