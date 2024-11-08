"use client";

import { useState, useEffect } from "react";

export default function Calendar({ birthDate }) {
  const [weeks, setWeeks] = useState([]);
  const TOTAL_WEEKS = 4160; // 80 years * 52 weeks

  useEffect(() => {
    const fetchWeeks = async () => {
      const response = await fetch("/api/weeks");
      const data = await response.json();
      setWeeks(data);
    };
    fetchWeeks();
  }, []);

  const calculateWeekStatus = (index) => {
    const birthDateTime = new Date(birthDate).getTime();
    const weekTime = birthDateTime + index * 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    return {
      isPast: weekTime <= now,
      date: new Date(weekTime),
      isFuture: weekTime > now,
    };
  };

  return (
    <div className="calendar-container">
      <div className="grid grid-cols-52 gap-1">
        {Array.from({ length: TOTAL_WEEKS }).map((_, index) => {
          const weekStatus = calculateWeekStatus(index);
          return (
            <WeekSquare
              key={index}
              isPast={weekStatus.isPast}
              isFuture={weekStatus.isFuture}
              date={weekStatus.date}
            />
          );
        })}
      </div>
    </div>
  );
}
