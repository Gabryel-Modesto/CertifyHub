import { useEffect, useState } from "react";

import styles from "./Countdown.module.css";

function Countdown({ blockedUntil, onFinish }) {
  const calculateTimeLeft = () => {
    const difference = new Date(blockedUntil).getTime() - new Date().getTime();

    if (difference <= 0) {
      return 0;
    }

    return Math.ceil(difference / 1000);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);

        if (onFinish) {
          onFinish();
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [blockedUntil]);

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className={styles.countdown}>
      <span>⏱️</span>

      <p>
        Tente novamente em <strong>{formattedTime}</strong>
      </p>
    </div>
  );
}

export default Countdown;
