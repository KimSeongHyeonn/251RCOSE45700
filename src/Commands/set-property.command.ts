import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";

export class SetPropertyCommand implements ICommand {
  private manager: ComponentManagerModel;

  private posX?: number;
  private posY?: number;
  private width?: number;
  private height?: number;

  constructor(manager: ComponentManagerModel, posX?: number, posY?: number, width?: number, height?: number) {
    this.manager = manager;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  public execute(): void {
    this.manager.setSelectedComponentsProperty({
      posX: this.posX,
      posY: this.posY,
      width: this.width,
      height: this.height,
    });
  }
}
