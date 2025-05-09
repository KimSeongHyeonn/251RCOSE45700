import { DrawableRectangle } from "~/Model/interfaces/drawable-shape.interface";
import { BaseDrawStrategy } from "~/ViewModel/drawStrategies/base-draw.strategy";

export class RectangleDrawStrategy extends BaseDrawStrategy<DrawableRectangle> {
  protected drawShape(ctx: CanvasRenderingContext2D, shape: DrawableRectangle): void {
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
  }
}
