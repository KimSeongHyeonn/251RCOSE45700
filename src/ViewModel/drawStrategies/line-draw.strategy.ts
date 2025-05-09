import { DrawableLine } from "~/Model/interfaces/drawable-shape.interface";
import { BaseDrawStrategy } from "~/ViewModel/drawStrategies/base-draw.strategy";

export class LineDrawStrategy extends BaseDrawStrategy<DrawableLine> {
  protected drawShape(ctx: CanvasRenderingContext2D, shape: DrawableLine): void {
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
  }
}
