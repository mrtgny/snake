export declare type KeyCodeType = "ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft"
export declare type DirectionType = "u" | "r" | "d" | "l"

export enum KeyCode {
    ArrowUp = "ArrowUp",
    ArrowRight = "ArrowRight",
    ArrowDown = "ArrowDown",
    ArrowLeft = "ArrowLeft"
}

export enum KeyCodeDirection {
    ArrowUp = "u",
    ArrowRight = "r",
    ArrowDown = "d",
    ArrowLeft = "l"
}

export enum OppositeKeyCodeDirection {
    ArrowUp = "d",
    ArrowDown = "u",
    ArrowLeft = "r",
    ArrowRight = "l",
};

export interface Dict<T = {}> {
    [key: string]: T;
}
