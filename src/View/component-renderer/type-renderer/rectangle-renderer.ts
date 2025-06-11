import { IComponent } from "~/Model/interfaces/component.interface";
import { BaseRenderer } from "~/View/component-renderer/type-renderer/base-renderer";

export class RectangleRenderer extends BaseRenderer {
  protected drawShape(ctx: CanvasRenderingContext2D, component: IComponent): void {
    const { x, y, width, height } = component.bound;
    ctx.rect(x, y, width, height);
  }
}
