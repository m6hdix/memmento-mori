"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Calendar from "@/components/Calendar";
import UserSetup from "@/components/UserSetup";

export default function Home() {
  const { data: session } = useSession();
  const [birthDate, setBirthDate] = useState(null);

  if (!session) {
    return (
      <main className="min-h-screen p-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">تقویم Memento Mori</h1>
        <button
          onClick={() => signIn()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ورود به حساب کاربری
        </button>
      </main>
    );
  }

  if (!birthDate) {
    return <UserSetup onBirthDateSet={setBirthDate} />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">تقویم Memento Mori</h1>
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
}
