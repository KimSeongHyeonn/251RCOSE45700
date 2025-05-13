import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";

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

  public isContainPoint({ x, y }: { x: number; y: number }): boolean {
    return this.component.isContainPoint({ x, y });
  }

  public get id(): number {
    return this.component.id;
  }

  public get type(): string {
    return this.component.type;
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
