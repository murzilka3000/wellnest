// client/src/hooks/useExercises.ts
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";

// Интерфейс для упражнения, как оно приходит с бэкенда
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroups?: string[];
  createdAt: string;
}

// Интерфейсы для DTO (передачи данных)
export interface CreateExerciseDto {
  name: string;
  description?: string;
  muscleGroups?: string[];
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string;
  muscleGroups?: string[];
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await api.get<Exercise[]>("/exercises");
      setExercises(response.data);
    } catch (err) {
      setError("Failed to load exercises.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const createExercise = useCallback(
    async (dto: CreateExerciseDto) => {
      try {
        await api.post("/exercises", dto);
        fetchExercises(); // Перезагружаем список после создания
      } catch (error) {
        setError("Failed to create exercise.");
        console.error(error);
        throw error; // Пробрасываем ошибку дальше
      }
    },
    [fetchExercises]
  );

  const updateExercise = useCallback(
    async (id: string, dto: UpdateExerciseDto) => {
      try {
        await api.put(`/exercises/${id}`, dto);
        fetchExercises(); // Перезагружаем список после обновления
      } catch (error) {
        setError("Failed to update exercise.");
        console.error(error);
        throw error;
      }
    },
    [fetchExercises]
  );

  const deleteExercise = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/exercises/${id}`);
        setExercises((prev) => prev.filter((e) => e.id !== id)); // Оптимистичное обновление
      } catch (error) {
        setError("Failed to delete exercise.");
        console.error(error);
        fetchExercises(); // Откат в случае ошибки
      }
    },
    [fetchExercises]
  );

  return {
    exercises,
    isLoading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    refetch: fetchExercises,
  };
};
