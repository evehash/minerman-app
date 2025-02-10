import { useEffect, useRef } from "react";

function useInterval(callback, delay, isActive): void {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    console.log("1!");
    if (!isActive || delay === null) return;

    const tick = (): void => {
      console.log("tick!" + savedCallback.current);
      if (savedCallback.current) {
        console.log("Call!");
        savedCallback.current();
      }
    };

    console.log("2!");
    tick();
    const id = setInterval(tick, delay);
    return (): void => clearInterval(id);
  }, [delay, isActive]);
}

export default useInterval;
