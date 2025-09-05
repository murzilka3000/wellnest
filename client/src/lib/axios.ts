// client/src/lib/axios.ts
import axios from "axios";

// Создаем кастомный экземпляр axios
const api = axios.create({
  baseURL: "http://localhost:3002", // Базовый URL нашего бэкенда
});

// Добавляем "перехватчик" (interceptor) запросов.
// Эта функция будет срабатывать ПЕРЕД КАЖДЫМ запросом, отправленным через `api`.
api.interceptors.request.use(
  (config) => {
    // Пытаемся достать токен из localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // Если токен есть, добавляем его в заголовок Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
