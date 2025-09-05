"use client";

import { useState, useMemo } from "react";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  isToday,
  formatDateToISO,
} from "@/utils/date-helpers";
import styles from "./HabitCalendar.module.scss"; // Будем использовать новые стили

interface HabitCalendarProps {
  completionHistory: string[]; // Массив дат 'YYYY-MM-DD'
}

export const HabitCalendar = ({ completionHistory }: HabitCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Текущий месяц/год, который отображаем

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth); // 0 = Sunday, 1 = Monday

  // Для более удобного поиска
  const completedDatesSet = useMemo(
    () => new Set(completionHistory),
    [completionHistory]
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Генерируем массив дней для отрисовки
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    const daysOfWeekOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Корректируем для начала с понедельника

    // Добавляем пустые дни до начала месяца
    for (let i = 0; i < daysOfWeekOffset; i++) {
      days.push(null);
    }
    // Добавляем дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth} className={styles.navButton}>
          &lt;
        </button>
        <h4 className={styles.monthTitle}>
          {getMonthName(currentMonth)} {currentYear}
        </h4>
        <button onClick={handleNextMonth} className={styles.navButton}>
          &gt;
        </button>
      </div>
      <div className={styles.weekdays}>
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>
      <div className={styles.daysGrid}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div key={`empty-${index}`} className={styles.emptyDay}></div>
            );
          }
          const dayDate = new Date(currentYear, currentMonth, day);
          const formattedDate = formatDateToISO(dayDate);
          const isDayCompleted = completedDatesSet.has(formattedDate);
          const isCurrentDay = isToday(dayDate);

          return (
            <div
              key={formattedDate}
              className={`${styles.day} ${
                isDayCompleted ? styles.completed : ""
              } ${isCurrentDay ? styles.today : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
