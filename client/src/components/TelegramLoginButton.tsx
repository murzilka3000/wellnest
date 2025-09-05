'use client';

import Script from 'next/script';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios'; // <-- ИЗМЕНЕНИЕ: Импортируем наш кастомный `api`

// ... (остальной код остается таким же, но меняем `axios.post` на `api.post`)
const TelegramLoginButton = () => {
    const { login } = useAuth();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      window.onTelegramAuth = async (user) => {
        try {
          // <-- ИЗМЕНЕНИЕ: Используем `api.post`
          const response = await api.post('/auth/telegram', user);
          login(response.data.access_token);
        } catch (error) {
          console.error('Ошибка при отправке данных на бэкенд:', error);
          alert('Произошла ошибка при входе.');
        }
      };
      return () => {
        window.onTelegramAuth = undefined;
      };
    }, [login]);
  
    useEffect(() => {
      if (scriptLoaded && buttonRef.current) {
        if (buttonRef.current.childElementCount > 0) return;
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', 'mywellnest_bot');
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-request-access', 'write');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        buttonRef.current.appendChild(script);
      }
    }, [scriptLoaded]);
  
    return (
      <>
        <Script
          src="https://telegram.org/js/telegram-widget.js?22"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
        <div ref={buttonRef}></div>
      </>
    );
  };
  
export default TelegramLoginButton;