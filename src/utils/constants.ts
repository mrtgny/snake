import { DirectionType, KeyCodeDirection } from "./types";

export const getInitialSnakePosition = () => [[5, 0], [5, 1], [5, 2]];
export const getInitialDirections: () => DirectionType[] = () => [KeyCodeDirection.ArrowRight];
export const getInitialDirection: () => DirectionType = () => KeyCodeDirection.ArrowRight;
