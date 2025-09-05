"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AddHabitForm } from "@/components/AddHabitForm";
import { HabitList } from "@/components/HabitList";
import TelegramLoginButton from "@/components/TelegramLoginButton";

export default function Home() {
  const { token, isLoading, logout } = useAuth();

  // Этот стейт нужен, чтобы "пнуть" HabitList и заставить его обновиться
  const [habitListKey, setHabitListKey] = useState(0);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {token ? (
        // --- ЭКРАН АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ ---
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Wellnest Dashboard</h1>
            <button onClick={logout}>Log Out</button>
          </div>
          <p>Welcome! You are logged in.</p>
          <hr style={{ margin: "2rem 0" }} />

          {/* Передаем функцию, которая изменит ключ и вызовет ре-рендер списка */}
          <AddHabitForm
            onHabitAdded={() => setHabitListKey((prevKey) => prevKey + 1)}
          />

          <div style={{ marginTop: "2rem" }}>
            {/* Передаем ключ, чтобы React пересоздал компонент при его изменении */}
            <HabitList key={habitListKey} />
          </div>
        </div>
      ) : (
        // --- ЭКРАН ВХОДА ---
        <div style={{ textAlign: "center", paddingTop: "20vh" }}>
          <h1>Welcome to Wellnest</h1>
          <p>Please log in to continue</p>
          <TelegramLoginButton />
        </div>
      )}
    </main>
  );
}
