"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

// Обновляем интерфейс, добавляем новое поле
interface Habit {
  id: string;
  title: string;
  isCompletedToday: boolean;
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

  const handleDelete = async (habitId: string) => {
    setHabits((currentHabits) => currentHabits.filter((h) => h.id !== habitId));
    try {
      await api.delete(`/habits/${habitId}`);
    } catch (error) {
      console.error("Failed to delete habit", error);
      alert("Could not delete habit. Please refresh the page.");
      fetchHabits();
    }
  };

  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  const handleToggleComplete = async (habit: Habit) => {
    // Оптимистичное обновление: меняем статус в UI немедленно
    setHabits((currentHabits) =>
      currentHabits.map((h) =>
        h.id === habit.id ? { ...h, isCompletedToday: !h.isCompletedToday } : h
      )
    );

    try {
      if (habit.isCompletedToday) {
        // Если была выполнена, отправляем запрос на удаление лога
        await api.delete(`/habits/${habit.id}/log`);
      } else {
        // Если не была, отправляем запрос на создание лога
        await api.post(`/habits/${habit.id}/log`);
      }
    } catch (error) {
      console.error("Failed to toggle habit status", error);
      alert("Could not update habit status. Please refresh.");
      // Откатываем изменение в случае ошибки
      setHabits((currentHabits) =>
        currentHabits.map((h) =>
          h.id === habit.id
            ? { ...h, isCompletedToday: habit.isCompletedToday }
            : h
        )
      );
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
            <li
              key={habit.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => handleToggleComplete(habit)}
            >
              {/* --- НАЧАЛО ИЗМЕНЕНИЙ: ДОБАВЛЯЕМ ЧЕКБОКС И СТИЛИ --- */}
              <span
                style={{
                  textDecoration: habit.isCompletedToday
                    ? "line-through"
                    : "none",
                  color: habit.isCompletedToday ? "gray" : "inherit",
                }}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={habit.isCompletedToday}
                  style={{ marginRight: "10px" }}
                />
                {habit.title}
              </span>
              {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(habit.id);
                }}
                style={{
                  color: "red",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
