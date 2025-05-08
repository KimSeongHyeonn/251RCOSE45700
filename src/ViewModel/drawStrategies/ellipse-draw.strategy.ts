import { DrawableEllipse } from "~/Model/interfaces/drawable-shape.interface";
import { DrawStrategy } from "~/ViewModel/drawStrategies/draw.strategy";

export class EllipseDrawStrategy implements DrawStrategy<DrawableEllipse> {
  draw(ctx: CanvasRenderingContext2D, shape: DrawableEllipse) {
    ctx.beginPath();
    ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, shape.rotation ?? 0, 0, 2 * Math.PI);
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
