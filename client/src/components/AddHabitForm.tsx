'use client';

import { useState } from 'react';
import api from '@/lib/axios';

interface AddHabitFormProps {
  onHabitAdded: () => void; // Функция, которая будет вызвана после добавления привычки
}

export const AddHabitForm = ({ onHabitAdded }: AddHabitFormProps) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // Не отправлять пустую строку

    setIsSubmitting(true);
    try {
      // Отправляем запрос на создание новой привычки
      await api.post('/habits', { title });
      setTitle(''); // Очищаем поле ввода
      onHabitAdded(); // Сообщаем родительскому компоненту, что нужно обновить список
    } catch (error) {
      console.error('Failed to add habit', error);
      alert('Could not add habit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Habit</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Drink water"
        disabled={isSubmitting}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Habit'}
      </button>
    </form>
  );
};