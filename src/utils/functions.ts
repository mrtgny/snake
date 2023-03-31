export const isBrowser = () => typeof window !== "undefined";

export const capitalize = (word: string) => {
  if (word) return word;
  let _word = word.split("");
  _word[0] = _word[0].toUpperCase();
  return _word;
};

export const searchIndexObjectInObject = (
  source: Array<unknown>,
  target: Array<unknown>,
) => JSON.stringify(source).indexOf(JSON.stringify(target));

export const preventZoom = () => {
  let lastTouchEnd = 0;
  const onTouchMove: EventListener = (event: Event) => {
    if (event.scale !== undefined && event.scale !== 1) {
      event.preventDefault();
    }
  };
  const onTouchEnd = (event: TouchEvent) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd, false);
  return () => {
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };
};

export const renderTime = (time: number) => {
  const _mintes = parseInt(`${time / 60}`);
  const _seconds = parseInt(`${time % 60}`);

  const minutes = _mintes < 10 ? "0" + _mintes : _mintes;
  const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

  return minutes + ":" + seconds;
};
