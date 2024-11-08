"use client";

import { useState } from "react";

export default function WeekSquare({
  weekNumber,
  isPast,
  date,
  note: initialNote,
  isCompleted: initialIsCompleted,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);

  const handleNoteUpdate = async (newNote) => {
    try {
      const response = await fetch("/api/weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber,
          note: newNote,
          isCompleted,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "خطا در بروزرسانی");
      }

      setNote(newNote);
    } catch (error) {
      console.error("Error updating note:", error);
      alert(error.message);
    }
  };

  const toggleCompletion = async () => {
    try {
      const response = await fetch("/api/weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weekNumber,
          note,
          isCompleted: !isCompleted,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "خطا در بروزرسانی");
      }

      setIsCompleted(!isCompleted);
    } catch (error) {
      console.error("Error toggling completion:", error);
      alert(error.message);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isPast) {
            toggleCompletion();
          }
        }}
        className={`
          w-6 h-6 sm:w-8 sm:h-8 border-2 rounded cursor-pointer transition-all duration-200
          ${isPast ? "bg-gray-300" : "bg-white"}
          ${isCompleted ? "bg-green-500 border-green-600" : ""}
          hover:border-blue-500 hover:scale-110
        `}
        title={`هفته ${weekNumber + 1}\n${date.toLocaleDateString("fa-IR")}\n${
          note || "بدون یادداشت"
        }\n${
          isCompleted ? "تکمیل شده" : "تکمیل نشده"
        }\nکلیک راست برای تغییر وضعیت`}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                یادداشت هفته {weekNumber + 1}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <textarea
              value={note || ""}
              onChange={(e) => handleNoteUpdate(e.target.value)}
              className="border p-3 w-full rounded mb-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="یادداشت خود را اینجا بنویسید..."
              dir="rtl"
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={toggleCompletion}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded"
                />
                <label>تکمیل شده</label>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors order-1 sm:order-2"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
