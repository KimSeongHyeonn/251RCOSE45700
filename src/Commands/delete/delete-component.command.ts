import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";

export class DeleteComponentCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private deletedComponent?: IComponent;
  private originalIndex?: number;

  constructor(componentManager: ComponentManager, componentId: number) {
    this.componentManager = componentManager;
    this.componentId = componentId;
  }

  execute(): void {
    try {
      this.deletedComponent = this.componentManager.findComponentById(this.componentId);

      if (this.deletedComponent) {
        const allComponents = this.componentManager.getAllComponents();
        this.originalIndex = allComponents.findIndex((c) => c.id === this.componentId);
      }

      this.componentManager.removeComponent(this.componentId);
    } catch (error) {
      this.deletedComponent = undefined;
      this.originalIndex = undefined;
      console.error("Failed to execute delete operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (!this.deletedComponent) return;

      this.componentManager.addComponent(this.deletedComponent);

      if (this.originalIndex !== undefined) {
        const currentIndex = this.componentManager.getAllComponents().length - 1;
        if (this.originalIndex !== currentIndex) {
          this.componentManager.changeComponentOrder(this.deletedComponent.id, this.originalIndex);
        }
      }
    } catch (error) {
      console.error("Failed to undo delete operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (!this.deletedComponent) return;

      this.componentManager.removeComponent(this.componentId);
    } catch (error) {
      console.error("Failed to redo delete operation:", error);
      throw error;
    }
  }
}
