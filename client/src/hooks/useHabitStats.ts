// client/src/hooks/useHabitStats.ts
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export interface HabitStats {
  habitTitle: string;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  completionHistory: string[];
}

export const useHabitStats = (habitId: string) => {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!habitId) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
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

  return { stats, isLoading, error };
};
