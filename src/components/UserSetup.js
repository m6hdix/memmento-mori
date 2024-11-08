"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function UserSetup({ onBirthDateSet }) {
  const { data: session } = useSession();
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/birthdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ birthDate }),
      });

      if (response.ok) {
        onBirthDateSet(birthDate);
      } else {
        throw new Error("خطا در ذخیره تاریخ تولد");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ذخیره تاریخ تولد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تاریخ تولد خود را وارد کنید
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            برای محاسبه دقیق هفته‌های زندگی شما
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700"
            >
              تاریخ تولد
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "در حال ذخیره..." : "ذخیره تاریخ تولد"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
