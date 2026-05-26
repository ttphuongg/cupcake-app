import { useState, useEffect } from 'react';

export function useOtpTimer(initialCountdown: number = 0) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const startCountdown = (seconds: number = 60) => {
    setCountdown(seconds);
  };

  const resetCountdown = () => {
    setCountdown(0);
  };

  return {
    countdown,
    startCountdown,
    resetCountdown,
  };
}
