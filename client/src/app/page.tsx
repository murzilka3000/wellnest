// client/src/app/page.tsx
import TelegramLoginButton from "@/components/TelegramLoginButton";

export default function Home() {
  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h1>Welcome to Wellnest</h1>
        <p>Please log in to continue</p>
        <TelegramLoginButton />
      </div>
    </main>
  );
}