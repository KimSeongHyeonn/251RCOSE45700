import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";

export interface IComponent {
  toDrawable(): DrawableShape[]; // 항상 배열로 반환(Group 고려);

  move({ dx, dy }: { dx: number; dy: number }): void;

  scale({ width, height }: { width: number; height: number }): void;

  get id(): number;
  get posX(): number;
  get posY(): number;
  get width(): number;
  get height(): number;
}
