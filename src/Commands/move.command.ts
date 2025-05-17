import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";

export class MoveCommand implements ICommand {
  private manager: ComponentManagerModel;

  private dx: number;
  private dy: number;

  constructor(manager: ComponentManagerModel, dx: number, dy: number) {
    this.manager = manager;
    this.dx = dx;
    this.dy = dy;
  }

  public execute(): void {
    this.manager.moveSelectedComponents({ dx: this.dx, dy: this.dy });
  }
}
