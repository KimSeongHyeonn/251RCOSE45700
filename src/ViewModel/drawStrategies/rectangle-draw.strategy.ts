import { DrawableRectangle } from "../../Model/interfaces/drawable-shape.interface";
import { DrawStrategy } from "./draw.strategy";

export class RectangleDrawStrategy implements DrawStrategy<DrawableRectangle> {
  draw(ctx: CanvasRenderingContext2D, shape: DrawableRectangle) {
    ctx.beginPath();
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    if (shape.fillStyle) {
      ctx.fillStyle = shape.fillStyle;
      ctx.fill();
    }
    if (shape.strokeStyle) {
      ctx.strokeStyle = shape.strokeStyle;
      if (shape.lineWidth !== undefined) {
        ctx.lineWidth = shape.lineWidth;
      }
      ctx.stroke();
    }
  }
}
