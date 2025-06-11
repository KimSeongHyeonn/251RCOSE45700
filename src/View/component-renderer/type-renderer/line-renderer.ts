import { IComponent } from "~/Model/interfaces/component.interface";
import { Line } from "~/Model/objects/line.object";
import { BaseRenderer } from "~/View/component-renderer/type-renderer/base-renderer";

export class LineRenderer extends BaseRenderer {
  protected drawShape(ctx: CanvasRenderingContext2D, component: IComponent): void {
    const line = component as Line;
    ctx.moveTo(line.startX, line.startY);
    ctx.lineTo(line.endX, line.endY);
  }
}
