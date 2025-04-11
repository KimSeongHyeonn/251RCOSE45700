import { IComponent } from "../interfaces/component.interface";
import { Component } from "./component.object";

export class Group extends Component {
  private children: IComponent[];

  constructor() {
    super({ posX: 0, posY: 0, width: 10, height: 10 });
    this.children = [];
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

  public draw(): void {
    console.log("Group");
  }

  public move({ x, y }: { x: number; y: number }): void {
    console.log("Group move");
  }

  public scale({ x, y }: { x: number; y: number }): void {
    console.log("Group scale");
  }
}
