import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { IdGenerator } from "~/Utils/id-generator";

export abstract class Component implements IComponent {
  private _id: number;
  private _posX: number;
  private _posY: number;
  private _width: number;
  private _height: number;
  private _fillStyle: string;
  private _strokeStyle: string;
  private _lineWidth: number;

  private readonly DefaultFillStyles = ["#DDEEFF", "#DFFFE0", "#FFE5D9", "#EBDFFC"];

  constructor({ posX = 0, posY = 0, width = 100, height = 100 }: { posX?: number; posY?: number; width?: number; height?: number }) {
    this._id = IdGenerator.getInstance().generateId();
    this._posX = posX;
    this._posY = posY;
    this._width = width;
    this._height = height;
    this._fillStyle = this.DefaultFillStyles[Math.floor(Math.random() * this.DefaultFillStyles.length)]; // 기본 채우기 색상: 랜덤
    this._strokeStyle = "#000000"; // 기본 선 색상: 검정색
    this._lineWidth = 1;
  }

  public abstract toDrawable(): DrawableShape[];

  public move({ dx, dy }: { dx: number; dy: number }): void {
    this._posX += dx;
    this._posY += dy;
  }

  public scale({ width, height }: { width: number; height: number }): void {
    this._width = width;
    this._height = height;
  }

  public get id(): number {
    return this._id;
  }

  public get posX(): number {
    return this._posX;
  }

  public get posY(): number {
    return this._posY;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get fillStyle(): string {
    return this._fillStyle;
  }

  public get strokeStyle(): string {
    return this._strokeStyle;
  }

  public get lineWidth(): number {
    return this._lineWidth;
  }
}
