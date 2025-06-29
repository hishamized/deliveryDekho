import { useState, useEffect } from "react";
import dayjs from "dayjs";

const CountdownTimer = ({ deadline }) => {
  const calculateTimeLeft = () => {
    const diff = dayjs(deadline).diff(dayjs(), "second");
    return diff > 0 ? diff : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const secsLeft = secs % 60;
    return `${hrs}h ${mins}m ${secsLeft}s`;
  };

  return (
    <span className="text-red-600 text-sm font-semibold">
      {formatTime(secondsLeft)}
    </span>
  );
};

export default CountdownTimer;
