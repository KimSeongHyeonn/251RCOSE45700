import { IComponent } from "~/Model/interfaces/component.interface";
import { Bound } from "~/Model/types/component.type";
import { ComponentTypeRenderer } from "~/View/component-renderer/interfaces/component-type-renderer.interface";

export abstract class BaseRenderer implements ComponentTypeRenderer {
  render(ctx: CanvasRenderingContext2D, component: IComponent): void {
    ctx.save();
    ctx.beginPath();

    this.drawShape(ctx, component);

    this.applyStyles(ctx, component);

    ctx.restore();
  }

  protected abstract drawShape(ctx: CanvasRenderingContext2D, component: IComponent): void;

  protected applyStyles(ctx: CanvasRenderingContext2D, component: IComponent): void {
    // 채우기 스타일
    if (component.style.fillStyle) {
      ctx.fillStyle = component.style.fillStyle;
      ctx.fill();
    }

    // 외곽선 스타일
    if (component.style.strokeStyle) {
      ctx.strokeStyle = component.style.strokeStyle;
      ctx.lineWidth = component.style.lineWidth || 1;

      if (component.style.lineDash) {
        ctx.setLineDash(component.style.lineDash);
      }

      ctx.stroke();
    }
  }
}
