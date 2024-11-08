"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Calendar from "@/components/Calendar";
import UserSetup from "@/components/UserSetup";

export default function Home() {
  const { data: session } = useSession();
  const [birthDate, setBirthDate] = useState(() => {
    return null;
  });

  if (!session) {
    return <LoginScreen />;
  }

  if (!birthDate) {
    return <UserSetup onBirthDateSet={setBirthDate} />;
  }

  return <MainDashboard birthDate={birthDate} />;
}

const LoginScreen = () => (
  <main className="min-h-screen p-8 flex flex-col items-center justify-center">
    <h1 className="text-3xl font-bold mb-4">تقویم Memento Mori</h1>
    <p className="text-gray-600 mb-8 text-center">
      هر لحظه از زندگی‌ات را با معنا کن، چون زمان همیشه در حال گذر است
    </p>
    <button
      onClick={() => signIn()}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      ورود به حساب کاربری
    </button>
  </main>
);

const MainDashboard = ({ birthDate }) => (
  <main className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4">تقویم Memento Mori</h1>
        <p className="text-gray-600 mb-8 text-center">
          هر لحظه از زندگی‌ات را با معنا کن، چون زمان همیشه در حال گذر است
        </p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          خروج
        </button>
      </div>
      <Calendar birthDate={birthDate} />
    </div>
  </main>
);
