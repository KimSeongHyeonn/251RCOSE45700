import { IComponent } from "~/Model/interfaces/component.interface";

export interface ComponentTypeRenderer {
  render: (ctx: CanvasRenderingContext2D, component: IComponent) => void;
}
