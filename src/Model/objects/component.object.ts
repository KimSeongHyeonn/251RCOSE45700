import { IComponent } from "~/Model/interfaces/component.interface";
import { Bound, ComponentType, Position, Style } from "~/Model/types/component.type";
import { IdGenerator } from "~/Utils/id-generator";

export abstract class Component implements IComponent {
  private _id: number;
  private _bound: Bound;
  private _style: Style;

  // 기본 채우기 색상 옵션
  private readonly DefaultFillStyles = ["#DDEEFF", "#DFFFE0", "#FFE5D9", "#EBDFFC"];

  constructor({ posX = 0, posY = 0, width = 100, height = 100 }: { posX?: number; posY?: number; width?: number; height?: number }) {
    this._id = IdGenerator.getInstance().generateId();
    this._bound = {
      x: posX,
      y: posY,
      width: width,
      height: height,
    };
    this._style = {
      fillStyle: this.DefaultFillStyles[Math.floor(Math.random() * this.DefaultFillStyles.length)], // 기본 채우기 색상: 랜덤
      strokeStyle: "#000000", // 기본 선 색상: 검정색
      lineWidth: 1,
      lineDash: [0, 0], // 기본 선 스타일: 실선
    };
  }

  public get id(): number {
    return this._id;
  }

  public abstract get type(): ComponentType;

  public get bound(): Bound {
    return this._bound;
  }

  public get style(): Style {
    return this._style;
  }

  public move({ dx, dy }: { dx: number; dy: number }): void {
    this._bound.x += dx;
    this._bound.y += dy;
  }

  public scale({ sx, sy }: { sx: number; sy: number }): void {
    this._bound.width *= sx;
    this._bound.height *= sy;
  }

  public setProperties(properties: Partial<Bound>): void {
    if (properties.x !== undefined) this._bound.x = properties.x;
    if (properties.y !== undefined) this._bound.y = properties.y;
    if (properties.width !== undefined) this._bound.width = properties.width;
    if (properties.height !== undefined) this._bound.height = properties.height;
  }

  public isContainPoint(point: Position): boolean {
    return (
      point.x >= this._bound.x && point.x <= this._bound.x + this._bound.width && point.y >= this._bound.y && point.y <= this._bound.y + this._bound.height
    );
  }
}
