import { IdGenerator } from "../../Utils/id-generator";
import { IComponent } from "../interfaces/component.interface";
import { DrawableShape } from "../interfaces/drawable-shape.interface";

export class Group implements IComponent {
  private _id: number;
  private children: IComponent[];

  constructor({ components = [] }: { components?: IComponent[] }) {
    this._id = IdGenerator.getInstance().generateId();
    this.children = components;
  }

  public add({ component }: { component: IComponent }): void {
    this.children.push(component);
  }

  public remove({ component }: { component: IComponent }): void {
    this.children = this.children.filter((c) => c !== component);
  }

  public getChildren(): IComponent[] {
    return this.children;
  }

  public toDrawable(): DrawableShape[] {
    return this.children.map((child) => child.toDrawable()).flat();
  }

  public move({ dx, dy }: { dx: number; dy: number }): void {
    for (const child of this.children) {
      child.move({ dx, dy });
    }
  }

  public scale({ width, height }: { width: number; height: number }): void {
    if (this.children.length === 0) return;

    const scaleX = width / this.width;
    const scaleY = height / this.height;

    const groupX = this.posX;
    const groupY = this.posY;

    // Group의 position을 기준으로 scaling
    for (const child of this.children) {
      const relX = child.posX - groupX;
      const relY = child.posY - groupY;

      child.scale({
        width: child.width * scaleX,
        height: child.height * scaleY,
      });

      child.move({
        dx: groupX + relX * scaleX - child.posX,
        dy: groupY + relY * scaleY - child.posY,
      });
    }
  }

  public get id(): number {
    return this._id;
  }

  public get posX(): number {
    if (this.children.length === 0) return 0;
    return Math.min(...this.children.map((child) => child.posX));
  }

  public get posY(): number {
    if (this.children.length === 0) return 0;
    return Math.min(...this.children.map((child) => child.posY));
  }

  public get width(): number {
    if (this.children.length === 0) return 0;
    const minX = Math.min(...this.children.map((child) => child.posX));
    const maxX = Math.max(...this.children.map((child) => child.posX + child.width));
    return maxX - minX;
  }

  public get height(): number {
    if (this.children.length === 0) return 0;
    const minY = Math.min(...this.children.map((child) => child.posY));
    const maxY = Math.max(...this.children.map((child) => child.posY + child.height));
    return maxY - minY;
  }
}
