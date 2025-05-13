import { DrawableEllipse } from "~/Model/interfaces/drawable-shape.interface";
import { BaseDrawStrategy } from "~/ViewModel/drawStrategies/base-draw.strategy";

export class EllipseDrawStrategy extends BaseDrawStrategy<DrawableEllipse> {
  protected drawShape(ctx: CanvasRenderingContext2D, shape: DrawableEllipse): void {
    ctx.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, shape.rotation ?? 0, 0, 2 * Math.PI);
  }
}
