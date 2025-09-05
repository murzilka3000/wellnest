"use client";

import { useState, useEffect } from "react";
import {
  CreateExerciseDto,
  UpdateExerciseDto,
  Exercise,
} from "@/hooks/useExercises";
import styles from "./ExerciseForm.module.scss";

interface ExerciseFormProps {
  initialData?: Exercise; // Для режима редактирования
  onSubmit: (data: CreateExerciseDto | UpdateExerciseDto) => Promise<void>;
  onCancel?: () => void;
  isSubmitting: boolean;
}

export const ExerciseForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ExerciseFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [muscleGroups, setMuscleGroups] = useState(
    initialData?.muscleGroups?.join(", ") || ""
  );

  // Сброс формы, если initialData меняется (например, при переключении с создания на редактирование)
  useEffect(() => {
    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setMuscleGroups(initialData?.muscleGroups?.join(", ") || "");
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dto = {
      name: name.trim(),
      description: description.trim() || undefined,
      muscleGroups: muscleGroups
        .split(",")
        .map((mg) => mg.trim())
        .filter(Boolean),
    };

    await onSubmit(dto);
  };

  return (
    <div className={styles.formContainer}>
      <h3>{initialData ? "Edit Exercise" : "Add New Exercise"}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Push-ups"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Keep body straight..."
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="muscleGroups">
            Muscle Groups (comma-separated, optional):
          </label>
          <input
            type="text"
            id="muscleGroups"
            value={muscleGroups}
            onChange={(e) => setMuscleGroups(e.target.value)}
            placeholder="e.g., Chest, Triceps"
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting
              ? initialData
                ? "Saving..."
                : "Adding..."
              : initialData
              ? "Save Changes"
              : "Add Exercise"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};




