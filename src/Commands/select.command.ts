import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";

export class SelectCommand implements ICommand {
  private manager: ComponentManagerModel;

  private component: IComponent | IComponent[];

  constructor(manager: ComponentManagerModel, component: IComponent);
  constructor(manager: ComponentManagerModel, components: IComponent[]);
  constructor(manager: ComponentManagerModel, component: IComponent | IComponent[]) {
    this.manager = manager;
    this.component = component;
  }

  public execute(): void {
    if (Array.isArray(this.component)) {
      this.manager.selectComponent(this.component);
    } else {
      this.manager.selectComponent(this.component);
    }
  }
}
