import { DrawableShape, ShapeType } from "~/Model/interfaces/drawable-shape.interface";
import { DrawStrategy } from "~/ViewModel/drawStrategies/draw.strategy";
import { EllipseDrawStrategy } from "~/ViewModel/drawStrategies/ellipse-draw.strategy";
import { LineDrawStrategy } from "~/ViewModel/drawStrategies/line-draw.strategy";
import { RectangleDrawStrategy } from "~/ViewModel/drawStrategies/rectangle-draw.strategy";

export class Drawer {
  private ctx: CanvasRenderingContext2D;

  private strategyMap: {
    [K in ShapeType]: DrawStrategy<any>;
  } = {
    rectangle: new RectangleDrawStrategy(),
    ellipse: new EllipseDrawStrategy(),
    line: new LineDrawStrategy(),
  };

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(shape: DrawableShape[]) {
    shape.forEach((s) => {
      const strategy = this.strategyMap[s.type];
      if (strategy) {
        strategy.draw(this.ctx, s);
      } else {
        console.error(`No draw strategy found for shape type: ${s.type}`);
      }
    });
  }
}
