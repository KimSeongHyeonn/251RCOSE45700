import { DrawableShape } from "../../Model/interfaces/drawable-shape.interface";

export interface DrawStrategy<T extends DrawableShape> {
  draw(ctx: CanvasRenderingContext2D, shape: T): void;
}
