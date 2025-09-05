'use client';

import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import api from '@/lib/axios'; // <-- Импортируем наш настроенный axios

export default function Home() {
  const { token, isLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState(null); // Стейт для хранения данных профиля
  const [apiError, setApiError] = useState(''); // Стейт для ошибок

  // Функция для вызова защищенного эндпоинта
  const handleGetProfileClick = async () => {
    setApiError('');
    setProfileData(null);
    try {
      // Отправляем GET-запрос на /users/me.
      // Наш "перехватчик" в lib/axios.ts автоматически добавит заголовок
      // Authorization: Bearer DEV_MODE_FAKE_TOKEN...
      const response = await api.get('/users/me');
      setProfileData(response.data);
    } catch (err) {
      // Мы ОЖИДАЕМ, что попадем сюда, потому что токен фейковый
      console.error(err);
      setApiError('ОШИБКА! Запрос был отклонен сервером (401 Unauthorized). Это ХОРОШО - наш AuthGuard работает!');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Этот блок сейчас не используется, но он понадобится, когда мы выключим DEV_MODE
  if (!token) {
    // В DEV_MODE мы сюда никогда не попадем, т.к. токен всегда есть
    return <div>Пожалуйста, войдите.</div>
  }

  // Главный экран приложения
  return (
    <main style={{ padding: '2rem' }}>
      <h1>DEV MODE - Welcome!</h1>
      <p>Your fake token is: <strong>{token}</strong></p>
      <button onClick={logout} style={{ marginTop: '20px' }}>
        Log Out (Dev)
      </button>

      <hr style={{ margin: '2rem 0' }} />

      {/* --- НАША ТЕСТОВАЯ СЕКЦИЯ --- */}
      <div>
        <h2>Тестирование AuthGuard</h2>
        <p>Нажми на кнопку, чтобы отправить запрос с фейковым токеном на защищенный эндпоинт <strong>GET /users/me</strong>.</p>
        <button onClick={handleGetProfileClick}>
          Проверить AuthGuard
        </button>

        {/* Блок для вывода результата */}
        {apiError && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid orange', background: '#fff3e0' }}>
            <strong>Результат:</strong>
            <p style={{ color: 'orange' }}>{apiError}</p>
          </div>
        )}
        {profileData && (
          <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid green', background: '#e8f5e9' }}>
             <strong>Результат:</strong>
            <p style={{ color: 'green' }}>УСПЕХ! Сервер вернул данные:</p>
            <pre>{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>
      {/* --- КОНЕЦ ТЕСТОВОЙ СЕКЦИИ --- */}
    </main>
  );
}