import { IComponent } from "../interfaces/component.interface";
import { DrawableShape } from "../interfaces/drawable-shape.interface";

export abstract class ComponentDecorator implements IComponent {
  protected component: IComponent;

  constructor(component: IComponent) {
    this.component = component;
  }

  public abstract toDrawable(): DrawableShape[];

  public move({ dx, dy }: { dx: number; dy: number }): void {
    this.component.move({ dx, dy });
  }

  public scale({ width, height }: { width: number; height: number }): void {
    this.component.scale({ width, height });
  }

  public get id(): number {
    return this.component.id;
  }

  public get posX(): number {
    return this.component.posX;
  }

  public get posY(): number {
    return this.component.posY;
  }

  public get width(): number {
    return this.component.width;
  }

  public get height(): number {
    return this.component.height;
  }
}
