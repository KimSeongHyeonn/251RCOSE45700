import { IComponent } from "~/Model/interfaces/component.interface";
import { Bound, ComponentType, Position, Style } from "~/Model/types/component.type";
import { IdGenerator } from "~/Utils/id-generator";

export class Group implements IComponent {
  private _id: number;
  private _children: IComponent[];

  constructor({ components = [] }: { components?: IComponent[] }) {
    this._id = IdGenerator.getInstance().generateId();
    this._children = components;
  }

  public add({ component }: { component: IComponent }): void {
    this._children.push(component);
  }

  public remove({ componentId }: { componentId: number }): void {
    this._children = this._children.filter((child) => child.id !== componentId);
  }

  public getChildren(): IComponent[] {
    return this._children;
  }

  public get id(): number {
    return this._id;
  }

  public get type(): ComponentType {
    return "group";
  }

  public get bound(): Bound {
    if (this._children.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    const childBounds = this._children.map((child) => child.bound);

    const minX = Math.min(...childBounds.map((b) => b.x));
    const minY = Math.min(...childBounds.map((b) => b.y));
    const maxX = Math.max(...childBounds.map((b) => b.x + b.width));
    const maxY = Math.max(...childBounds.map((b) => b.y + b.height));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  public get style(): Style {
    return {
      fillStyle: undefined,
      strokeStyle: undefined,
      lineWidth: undefined,
      lineDash: undefined,
    };
  }

  public move({ dx, dy }: { dx: number; dy: number }): void {
    for (const child of this._children) {
      child.move({ dx, dy });
    }
  }

  public scale({ sx, sy }: { sx: number; sy: number }): void {
    if (this._children.length === 0) return;

    // 기준점
    const originX = this.bound.x;
    const originY = this.bound.y;

    // 각 자식 요소에 대해 크기 조정 및 위치 조정
    for (const child of this._children) {
      const childBound = { ...child.bound };

      const relX = childBound.x - originX;
      const relY = childBound.y - originY;

      const newX = originX + relX * sx;
      const newY = originY + relY * sy;

      const dx = newX - childBound.x;
      const dy = newY - childBound.y;

      child.move({ dx, dy });
      child.scale({ sx, sy });
    }
  }

  public setProperties(properties: Partial<Bound>): void {
    if (this._children.length === 0) return;

    // 현재 바운딩 박스
    const currentBound = this.bound;

    // 이동 계산 (x, y 속성)
    if (properties.x !== undefined || properties.y !== undefined) {
      const dx = properties.x !== undefined ? properties.x - currentBound.x : 0;
      const dy = properties.y !== undefined ? properties.y - currentBound.y : 0;

      if (dx !== 0 || dy !== 0) {
        this.move({ dx, dy });
      }
    }

    // 크기 조정 계산 (width, height 속성)
    if (properties.width !== undefined || properties.height !== undefined) {
      // 0으로 나누기 방지
      if (currentBound.width === 0 || currentBound.height === 0) return;

      const sx = properties.width !== undefined ? properties.width / currentBound.width : 1;
      const sy = properties.height !== undefined ? properties.height / currentBound.height : 1;

      if (sx !== 1 || sy !== 1) {
        this.scale({ sx, sy });
      }
    }
  }

  public isContainPoint(point: Position): boolean {
    return this._children.some((child) => child.isContainPoint(point));
  }
}
