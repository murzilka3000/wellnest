// client/src/utils/date-helpers.ts

// Вспомогательные функции для работы с датами в календаре

/**
 * Получает название месяца по его номеру (0 = Январь, 11 = Декабрь)
 */
export const getMonthName = (monthIndex: number): string => {
  const date = new Date(2000, monthIndex, 1); // Используем 2000 год, так как это високосный и не влияет на название месяца
  return date.toLocaleString('default', { month: 'long' });
};

/**
 * Получает количество дней в заданном месяце и году
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Получает день недели, с которого начинается месяц (0 = Воскресенье, 1 = Понедельник)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Форматирует дату в формат 'YYYY-MM-DD'
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Проверяет, является ли дата сегодняшним днем (без учета времени)
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};