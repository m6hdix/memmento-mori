"use client";

import { useState } from "react";

export default function WeekSquare({
  weekNumber,
  isPast,
  date,
  note,
  isCompleted,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNoteUpdate = async (newNote) => {
    try {
      await fetch("/api/weeks", {
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
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className={`
          w-4 h-4 border rounded-sm cursor-pointer
          ${isPast ? "bg-gray-300" : "bg-white"}
          ${isCompleted ? "bg-green-500" : ""}
          hover:border-blue-500
        `}
        title={`هفته ${weekNumber + 1}\n${date.toLocaleDateString("fa-IR")}`}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h3>یادداشت هفته {weekNumber + 1}</h3>
            <textarea
              defaultValue={note}
              onChange={(e) => handleNoteUpdate(e.target.value)}
              className="border p-2 w-full"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </>
  );
}
