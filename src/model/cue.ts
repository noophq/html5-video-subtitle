import { Period } from "lib/model/period";

export enum TextAlign {
    LEFT,
    RIGHT,
    CENTER,
}

export enum FontWeight {
    BOLD,
    NORMAL,
}

export enum TextDecoration {
    UNDERLINE,
    OVERLINE,
    LINE_THROUGH,
}

export interface Region {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Cue extends Period {
    id: number | string;
    payload: string;
    region?: Region;
    textAlign?: TextAlign;
    color?: string;
    backgroundColor?: string;
    lineHeight?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: FontWeight;
    textDecoration?: TextDecoration;
}
