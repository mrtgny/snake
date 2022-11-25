const CountDown = ({ countDown }: { countDown: number }): JSX.Element => {
  const className = !countDown
    ? "count-down-container-out"
    : "count-down-container";
  return <div className={className + " center count-down"}>{countDown}</div>;
};

export default CountDown;
