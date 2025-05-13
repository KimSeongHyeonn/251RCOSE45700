import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";

export interface IComponent {
  toDrawable(): DrawableShape[]; // 항상 배열로 반환(Group 고려);

  move({ dx, dy }: { dx: number; dy: number }): void;

  scale({ width, height }: { width: number; height: number }): void;

  isContainPoint({ x, y }: { x: number; y: number }): boolean;

  get id(): number;
  get type(): string;
  get posX(): number;
  get posY(): number;
  get width(): number;
  get height(): number;
}
