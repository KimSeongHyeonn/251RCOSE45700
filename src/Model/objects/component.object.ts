import { IdGenerator } from "../../Utils/id-generator";
import { IComponent } from "../interfaces/component.interface";

export abstract class Component implements IComponent {
  private _id: number;
  private _posX: number;
  private _posY: number;
  private _width: number;
  private _height: number;

  constructor({ posX, posY, width, height }: { posX: number; posY: number; width: number; height: number }) {
    this._id = IdGenerator.getInstance().generateId();
    this._posX = posX;
    this._posY = posY;
    this._width = width;
    this._height = height;
  }

  public abstract draw(): void;

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
}
