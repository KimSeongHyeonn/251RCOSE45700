import { ICommand } from "~/Commands/interfaces/command.interface";
import { IComponent } from "~/Model/interfaces/component.interface";

export class ScaleCommand implements ICommand {
  private component: IComponent;
  private width: number;
  private height: number;

  constructor(component: IComponent, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid width or height");
    }
    this.component = component;
    this.width = width;
    this.height = height;
  }

  public execute(): void {
    this.component.scale({ width: this.width, height: this.height });
  }
}
