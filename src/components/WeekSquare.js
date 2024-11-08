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
          w-4 h-4 border rounded-sm cursor-pointer
          ${isPast ? "bg-gray-300" : "bg-white"}
          ${isCompleted ? "bg-green-500" : ""}
          hover:border-blue-500
        `}
        title={`هفته ${weekNumber + 1}\n${date.toLocaleDateString("fa-IR")}\n${
          note || "بدون یادداشت"
        }\n${
          isCompleted ? "تکمیل شده" : "تکمیل نشده"
        }\nکلیک راست برای تغییر وضعیت`}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-80">
            <h3 className="text-lg font-bold mb-2">
              یادداشت هفته {weekNumber + 1}
            </h3>
            <textarea
              value={note || ""}
              onChange={(e) => handleNoteUpdate(e.target.value)}
              className="border p-2 w-full rounded mb-2 min-h-[100px]"
              placeholder="یادداشت خود را اینجا بنویسید..."
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                بستن
              </button>
              <div className="flex items-center">
                <label className="ml-2">تکمیل شده:</label>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={toggleCompletion}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
