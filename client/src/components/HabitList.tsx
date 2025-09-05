"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

// Описываем, как выглядит объект привычки
interface Habit {
  id: string;
  title: string;
}

export const HabitList = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Функция для загрузки привычек с сервера
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

  // Загружаем привычки при первом рендере компонента
  useEffect(() => {
    fetchHabits();
  }, []);

  if (isLoading) return <p>Loading habits...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>My Habits List</h3>
      {habits.length === 0 ? (
        <p>You have no habits yet. Add one!</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>{habit.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
