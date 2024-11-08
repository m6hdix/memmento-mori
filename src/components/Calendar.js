"use client";

import { useState, useEffect } from "react";
import WeekSquare from "./WeekSquare";

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
      isPast: weekTime < now,
      date: new Date(weekTime),
    };
  };

  return (
    <div className="grid grid-cols-52 gap-1">
      {[...Array(TOTAL_WEEKS)].map((_, index) => {
        const status = calculateWeekStatus(index);
        const weekData = weeks.find((w) => w.weekNumber === index);

        return (
          <WeekSquare
            key={index}
            weekNumber={index}
            isPast={status.isPast}
            date={status.date}
            note={weekData?.note}
            isCompleted={weekData?.isCompleted}
          />
        );
      })}
    </div>
  );
}
