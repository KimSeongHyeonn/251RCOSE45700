import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";

export class ClearSelectCoomand implements ICommand {
  private manager: ComponentManagerModel;

  constructor(manager: ComponentManagerModel) {
    this.manager = manager;
  }

  public execute(): void {
    this.manager.clearSelection();
  }
}
