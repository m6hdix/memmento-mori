"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  const tooltipText = useMemo(() => {
    return `هفته ${weekNumber + 1}\n${date.toLocaleDateString("fa-IR")}\n${
      note || "بدون یادداشت"
    }\n${isCompleted ? "تکمیل شده" : "تکمیل نشده"}\nکلیک راست برای تغییر وضعیت`;
  }, [weekNumber, date, note, isCompleted]);

  const updateWeekData = useCallback(
    async (data) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/weeks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weekNumber,
            ...data,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "خطا در بروزرسانی");
        }

        return await response.json();
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [weekNumber]
  );

  const handleNoteUpdate = async (newNote) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setNote(newNote);

    debounceTimer.current = setTimeout(async () => {
      try {
        await updateWeekData({ note: newNote, isCompleted });
        toast.success("یادداشت با موفقیت ذخیره شد");
      } catch (error) {
        toast.error(error.message);
      }
    }, 500);
  };

  const toggleCompletion = async () => {
    if (isPast) return;

    try {
      await updateWeekData({ note, isCompleted: !isCompleted });
      setIsCompleted(!isCompleted);
      toast.success(
        !isCompleted
          ? "هفته به عنوان تکمیل شده ثبت شد"
          : "وضعیت تکمیل هفته برداشته شد"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);

  return (
    <>
      <div
        onClick={() => !isLoading && !isPast && setIsModalOpen(true)}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isLoading && !isPast) {
            toggleCompletion();
          }
        }}
        className={`
          relative w-6 h-6 sm:w-8 sm:h-8 border-2 rounded transition-all duration-200
          ${isPast ? "bg-gray-300 cursor-default" : "bg-black cursor-pointer"}
          ${isCompleted ? "bg-green-500 border-green-600" : ""}
          ${
            isLoading
              ? "opacity-50 cursor-wait"
              : !isPast
              ? "hover:border-blue-500 hover:scale-110"
              : ""
          }
        `}
        title={tooltipText}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onKeyDown={handleKeyPress}
        >
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                یادداشت هفته {weekNumber + 1}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
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
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={toggleCompletion}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded"
                  disabled={isLoading || isPast}
                />
                <label>تکمیل شده</label>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`
                  w-full sm:w-auto px-6 py-2 rounded-lg transition-colors order-1 sm:order-2
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }
                `}
                disabled={isLoading}
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
