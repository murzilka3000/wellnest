// client/src/types.d.ts

// Описываем данные, которые приходят от виджета
interface TelegramAuthUser {
  id: number;
  first_name: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// Объявляем глобальный интерфейс для window
declare global {
  interface Window {
    // Свойство для виджета авторизации (кнопки)
    Telegram?: any; // Оставим any для простоты, т.к. виджет сложный
    
    // Callback-функция, которую мы сами создаем для виджета
    onTelegramAuth?: (user: TelegramAuthUser) => void;

    // Свойство для Mini App API
    TelegramWebApp?: {
      initData: string;
      // Здесь могут быть и другие поля и методы Mini App
    };
  }
}

// Эта строка нужна, чтобы TypeScript считал этот файл модулем.
// Просто добавь ее в конец.
export {};