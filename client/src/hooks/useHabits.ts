// client/src/hooks/useHabits.ts
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

export interface Habit {
  id: string;
  title: string;
  isCompletedToday: boolean;
  streak: number;
}

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get<Habit[]>("/habits");
      setHabits(response.data);
    } catch (err) {
      setError("Failed to load habits.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const deleteHabit = useCallback(
    async (habitId: string) => {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      try {
        await api.delete(`/habits/${habitId}`);
      } catch (error) {
        console.error("Failed to delete habit", error);
        fetchHabits();
      }
    },
    [fetchHabits]
  );

  const toggleHabit = useCallback(
    async (habit: Habit) => {
      try {
        if (habit.isCompletedToday) {
          await api.delete(`/habits/${habit.id}/log`);
        } else {
          await api.post(`/habits/${habit.id}/log`);
        }
        fetchHabits();
      } catch (error) {
        console.error("Failed to toggle habit status", error);
        fetchHabits();
      }
    },
    [fetchHabits]
  );

  return {
    habits,
    isLoading,
    error,
    deleteHabit,
    toggleHabit,
    refetch: fetchHabits,
  };
};
