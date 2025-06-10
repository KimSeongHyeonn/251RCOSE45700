export type ComponentType = "rectangle" | "ellipse" | "line" | "group";

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Style = {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  lineDash?: number[];
};

export type Bound = Position & Size;
