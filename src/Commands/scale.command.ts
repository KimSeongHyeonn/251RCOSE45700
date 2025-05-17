import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { HandlePosition } from "~/Model/decorators/selected-component.decorator";

export class ScaleCommand implements ICommand {
  private manager: ComponentManagerModel;

  private handle: HandlePosition;
  private dx: number;
  private dy: number;

  constructor(manager: ComponentManagerModel, handle: HandlePosition, dx: number, dy: number) {
    this.manager = manager;
    this.handle = handle;
    this.dx = dx;
    this.dy = dy;
  }

  public execute(): void {
    this.manager.scaleSelectedComponents({ handlePosition: this.handle, dx: this.dx, dy: this.dy });
  }
}
