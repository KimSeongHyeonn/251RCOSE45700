import { IComponent } from "~/Model/interfaces/component.interface";
import { BaseRenderer } from "~/View/component-renderer/type-renderer/base-renderer";

export class EllipseRenderer extends BaseRenderer {
  protected drawShape(ctx: CanvasRenderingContext2D, component: IComponent): void {
    const { x, y, width, height } = component.bound;
    const radiusX = width / 2;
    const radiusY = height / 2;
    ctx.ellipse(x + radiusX, y + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  }
}
