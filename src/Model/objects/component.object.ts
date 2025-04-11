import { IdGenerator } from "../../Utils/id-generator";
import { IComponent } from "../interfaces/component.interface";

export abstract class Component implements IComponent {
  private id: number;
  private posX: number;
  private posY: number;
  private width: number;
  private height: number;

  constructor({
    posX,
    posY,
    width,
    height,
  }: {
    posX: number;
    posY: number;
    width: number;
    height: number;
  }) {
    this.id = IdGenerator.getInstance().generateId();
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  abstract draw(): void;

  abstract move({ x, y }: { x: number; y: number }): void;

  abstract scale({ x, y }: { x: number; y: number }): void;
}
