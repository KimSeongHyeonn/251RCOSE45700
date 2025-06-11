import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";

export abstract class CreateComponentCommand<T extends IComponent> implements ICommand {
  protected componentManager: ComponentManager;
  protected createdComponent?: T;

  constructor(componentManager: ComponentManager) {
    this.componentManager = componentManager;
  }

  abstract execute(): void;

  undo(): void {
    try {
      if (!this.createdComponent) return;

      this.componentManager.removeComponent(this.createdComponent.id);
    } catch (error) {
      console.error("Failed to undo create component operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (!this.createdComponent) return;

      this.componentManager.addComponent(this.createdComponent);
    } catch (error) {
      console.error("Failed to redo create component operation:", error);
      throw error;
    }
  }
}
