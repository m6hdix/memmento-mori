"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function UserSetup({ onBirthDateSet }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [birthDate, setBirthDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // چک کردن تاریخ تولد موجود
  useEffect(() => {
    const checkExistingBirthDate = async () => {
      try {
        const response = await fetch("/api/user/birthdate");
        const data = await response.json();

        if (data.birthDate) {
          setBirthDate(new Date(data.birthDate).toISOString().split("T")[0]);
          onBirthDateSet(data.birthDate);
        }
      } catch (error) {
        console.error("Error fetching birth date:", error);
      }
    };

    if (session) {
      checkExistingBirthDate();
    }
  }, [session]);

  // اگر کاربر لاگین نکرده است
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // اعتبارسنجی تاریخ
      const birthDateObj = new Date(birthDate);
      const today = new Date();

      if (birthDateObj > today) {
        throw new Error("تاریخ تولد نمی‌تواند در آینده باشد");
      }

      if (birthDateObj.getFullYear() < 1900) {
        throw new Error("تاریخ تولد نامعتبر است");
      }

      // Make sure we have a valid session and user ID
      if (!session?.user?.email) {
        throw new Error("لطفاً دوباره وارد سیستم شوید");
      }

      const response = await fetch("/api/user/birthdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate,
          email: session.user.email,
          userId: session.user.id, // Add user ID to the request
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "خطا در ذخیره تاریخ تولد");
      }

      const data = await response.json();
      onBirthDateSet(birthDate);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.message ||
          "خطا در ذخیره تاریخ تولد. لطفاً دوباره وارد سیستم شوید."
      );
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

        {error && (
          <div
            className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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
              max={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تاریخ تولد"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
