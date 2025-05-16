import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { Ellipse } from "~/Model/objects/ellipse.object";

export class CreateEllipseCommand implements ICommand {
  private props: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  private manager: ComponentManagerModel;

  constructor(props: { x: number; y: number; width: number; height: number }, manager: ComponentManagerModel) {
    this.props = props;
    this.manager = manager;
  }

  public execute(): void {
    const { x, y, width, height } = this.props;
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid width or height");
    }
    this.manager.addComponent(new Ellipse({ posX: x, posY: y, width, height }));
  }
}
