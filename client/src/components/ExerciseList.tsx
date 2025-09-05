"use client";

import { useState } from "react";
import {
  useExercises,
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
} from "@/hooks/useExercises"; // Импортируем DTO
import { ExerciseForm } from "./ExerciseForm";
import styles from "./ExerciseList.module.scss";

const ExerciseItem = ({
  exercise,
  onEdit,
  onDelete,
}: {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exerciseId: string) => void;
}) => (
  <li className={styles.item}>
    <div className={styles.info}>
      <span className={styles.name}>{exercise.name}</span>
      {exercise.description && (
        <span className={styles.details}>{exercise.description}</span>
      )}
      {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
        <div className={styles.details}>
          {exercise.muscleGroups.map((mg) => (
            <span key={mg} className={styles.muscleGroup}>
              {mg}
            </span>
          ))}
        </div>
      )}
    </div>
    <div className={styles.actions}>
      <button onClick={() => onEdit(exercise)} className={styles.editButton}>
        ✏️
      </button>
      <button
        onClick={() => onDelete(exercise.id)}
        className={styles.deleteButton}
      >
        &times;
      </button>
    </div>
  </li>
);

export const ExerciseList = () => {
  const {
    exercises,
    isLoading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
    refetch,
  } = useExercises();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // --- НАЧАЛО ИЗМЕНЕНИЙ: Универсальная функция для создания/обновления ---
  const handleFormSubmit = async (
    data: CreateExerciseDto | UpdateExerciseDto
  ) => {
    setIsSubmittingForm(true);
    try {
      if (editingExercise) {
        await updateExercise(editingExercise.id, data as UpdateExerciseDto); // Приводим к типу UpdateExerciseDto
      } else {
        await createExercise(data as CreateExerciseDto); // Приводим к типу CreateExerciseDto
      }
      setIsFormVisible(false);
      setEditingExercise(null);
    } finally {
      setIsSubmittingForm(false);
    }
  };
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---

  const handleEditClick = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingExercise(null);
  };

  if (isLoading) return <p>Loading exercises...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.exerciseListContainer}>
      <h2>My Exercises</h2>

      {!isFormVisible && !editingExercise && (
        <button onClick={() => setIsFormVisible(true)}>Add New Exercise</button>
      )}

      {(isFormVisible || editingExercise) && (
        <ExerciseForm
          initialData={editingExercise || undefined}
          onSubmit={handleFormSubmit} // <-- Передаем универсальную функцию
          onCancel={handleCancelForm}
          isSubmitting={isSubmittingForm}
        />
      )}

      {exercises.length === 0 && !isFormVisible && !editingExercise ? (
        <p>No exercises yet. Click "Add New Exercise" to create one.</p>
      ) : (
        <ul className={styles.list}>
          {exercises.map((exercise) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              onEdit={handleEditClick}
              onDelete={deleteExercise}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
