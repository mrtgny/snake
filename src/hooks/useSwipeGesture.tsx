import { TouchEventHandler, useCallback, useRef } from "react";
import { KeyCode } from "utils/types";

export const useSwipGesture = () => {
  const initial = useRef([0, 0]);
  const lastTouch = useRef<React.Touch>();

  const onTouchStart: TouchEventHandler<HTMLDivElement> = useCallback((ev) => {
    ev.cancelable = false;
    const touch = (ev.touches || [])[0];
    if (!touch) return;
    initial.current[0] = touch.clientX;
    initial.current[1] = touch.clientY;
  }, []);

  const onTouchMove: TouchEventHandler<HTMLDivElement> = useCallback((ev) => {
    const touch = (ev.touches || [])[0];
    if (!touch) return;
    lastTouch.current = touch;
  }, []);

  const onTouchEnd: TouchEventHandler<HTMLDivElement> = useCallback((ev) => {
    const touch = lastTouch.current;
    if (!touch) return;
    const mX = touch.clientX - initial.current[0];
    const mY = touch.clientY - initial.current[1];

    if (Math.abs(mX) > 20 && Math.abs(mX) > Math.abs(mY)) {
      if (mX > 0) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { code: KeyCode.ArrowRight })
        );
      } else {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { code: KeyCode.ArrowLeft })
        );
      }
    } else if (Math.abs(mY) > 20 && Math.abs(mY) > Math.abs(mX)) {
      if (mY > 0) {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { code: KeyCode.ArrowDown })
        );
      } else {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { code: KeyCode.ArrowUp })
        );
      }
    }
    lastTouch.current = undefined;
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
