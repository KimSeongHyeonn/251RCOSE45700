import { Group } from "~/Model/objects/group.object";
import { IComponent } from "~/Model/interfaces/component.interface";
import { BaseRenderer } from "~/View/component-renderer/type-renderer/base-renderer";
import { ComponentRenderer } from "~/View/component-renderer/component-renderer";

export class GroupRenderer extends BaseRenderer {
  constructor(private componentRenderer: ComponentRenderer) {
    super();
  }

  // 자체 그리기 X
  protected drawShape(ctx: CanvasRenderingContext2D, component: IComponent): void {}

  // 자체 스타일 X
  protected override applyStyles(ctx: CanvasRenderingContext2D, component: IComponent): void {}
}
