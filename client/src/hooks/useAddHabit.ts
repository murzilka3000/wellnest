import { useState } from 'react';
import api from '@/lib/axios';

export const useAddHabit = (onSuccess: () => void) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('/habits', { title });
      setTitle('');
      onSuccess(); // Вызываем callback после успешного добавления
    } catch (error) {
      console.error('Failed to add habit', error);
      alert('Could not add habit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { title, setTitle, isSubmitting, handleSubmit };
};