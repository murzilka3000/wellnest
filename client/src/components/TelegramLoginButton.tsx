'use client';

import Script from 'next/script';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react'; // <-- Импортируем хуки

interface TelegramUser {
  id: number;
  first_name: string;
  username: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    Telegram: any;
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

const TelegramLoginButton = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null); // <-- Ссылка на контейнер для кнопки

  const handleTelegramResponse = async (user: TelegramUser) => {
    console.log('Получены данные от Telegram:', user);
    try {
      const response = await axios.post('http://localhost:3000/auth/telegram', user);
      console.log('Ответ от нашего бэкенда:', response.data);
      alert('Успешный вход! Токен в консоли.');
    } catch (error) {
      console.error('Ошибка при отправке данных на бэкенд:', error);
      alert('Произошла ошибка при входе.');
    }
  };

  if (typeof window !== 'undefined') {
    window.onTelegramAuth = handleTelegramResponse;
  }

  // Этот useEffect будет рендерить кнопку, когда скрипт загрузится
  useEffect(() => {
    if (scriptLoaded && buttonRef.current) {
      // Убеждаемся, что кнопка не будет создана дважды
      if (buttonRef.current.childElementCount > 0) return;

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'mywellnest_bot'); // <-- ВАЖНО: ИМЯ ПОЛЬЗОВАТЕЛЯ БОТА
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', 'http://127.0.0.1:3001'); // Не используется напрямую, но хорошая практика
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      
      buttonRef.current.appendChild(script);
    }
  }, [scriptLoaded]);

  return (
    <>
      {/* Скрытый скрипт для загрузки виджета, чтобы установить флаг scriptLoaded */}
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)} // <-- Устанавливаем флаг после загрузки
      />
      {/* Контейнер, куда будет вставлена кнопка */}
      <div ref={buttonRef}></div>
    </>
  );
};

export default TelegramLoginButton;



