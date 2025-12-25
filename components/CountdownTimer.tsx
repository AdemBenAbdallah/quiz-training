"use client";

import { useEffect, useState } from "react";

const END_DATE_KEY = "countdown_end_date";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let endTime: Date;

    const savedEndDate = localStorage.getItem(END_DATE_KEY);
    if (savedEndDate) {
      endTime = new Date(savedEndDate);
    } else {
      const startTime = new Date();
      endTime = new Date(startTime.getTime() + 6 * 24 * 60 * 60 * 1000);
      localStorage.setItem(END_DATE_KEY, endTime.toISOString());
    }

    const timer = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        localStorage.removeItem(END_DATE_KEY);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <span className="font-mono text-red-700 font-bold">
      {timeLeft.days}d {formatTime(timeLeft.hours)}:
      {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </span>
  );
}
