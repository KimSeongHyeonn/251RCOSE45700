import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";

export class SelectCommand implements ICommand {
  private component: IComponent;
  private manager: ComponentManagerModel;

  constructor(component: IComponent, manager: ComponentManagerModel) {
    this.component = component;
    this.manager = manager;
  }

  public execute(): void {
    this.manager.selectComponent(this.component.id);
  }
}
