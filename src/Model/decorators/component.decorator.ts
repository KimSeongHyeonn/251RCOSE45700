import { IComponent } from "~/Model/interfaces/component.interface";
import { Bound, ComponentType } from "~/Model/types/component.type";

export abstract class ComponentDecorator implements IComponent {
  protected component: IComponent;

  constructor(component: IComponent) {
    this.component = component;
  }

  public move({ dx, dy }: { dx: number; dy: number }): void {
    this.component.move({ dx, dy });
  }

  public scale({ sx, sy }: { sx: number; sy: number }): void {
    this.component.scale({ sx, sy });
  }

  public setProperties(properties: Partial<Bound>): void {
    this.component.setProperties(properties);
  }

  public isContainPoint({ x, y }: { x: number; y: number }): boolean {
    return this.component.isContainPoint({ x, y });
  }

  public get id(): number {
    return this.component.id;
  }

  public get type(): ComponentType {
    return this.component.type;
  }

  public get bound() {
    return this.component.bound;
  }

  public get style() {
    return this.component.style;
  }
}
