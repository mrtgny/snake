export const isBrowser = () => typeof window !== "undefined";

export const capitalize = (word: string) => {
  if (word) return word;
  let _word = word.split("");
  _word[0] = _word[0].toUpperCase();
  return _word;
};

export const preventZoom = () => {
  document.addEventListener(
    "touchmove",
    function (event) {
      if (event["scale"] !== undefined && event["scale"] !== 1) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
  var lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      var now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
};

export const renderTime = (time: number) => {
  const _mintes = parseInt(`${time / 60}`);
  const _seconds = parseInt(`${time % 60}`);

  const minutes = _mintes < 10 ? "0" + _mintes : _mintes;
  const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

  return minutes + ":" + seconds;
};
