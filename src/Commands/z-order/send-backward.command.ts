import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class SendBackwardCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private originalIndex: number = -1;

  constructor(componentManager: ComponentManager, componentId: number) {
    this.componentManager = componentManager;
    this.componentId = componentId;
  }

  execute(): void {
    try {
      const allComponents = this.componentManager.getAllComponents();
      this.originalIndex = allComponents.findIndex((c) => c.id === this.componentId);

      if (this.originalIndex === 0) {
        console.warn(`Component with ID ${this.componentId} is already at the back`);
        return;
      }

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex - 1);
    } catch (error) {
      console.error("Failed to send component backward:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.originalIndex === -1) return;

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex);
    } catch (error) {
      console.error("Failed to undo send backward operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      const allComponents = this.componentManager.getAllComponents();
      const currentIndex = allComponents.findIndex((c) => c.id === this.componentId);

      if (currentIndex === 0) return;

      this.componentManager.changeComponentOrder(this.componentId, currentIndex - 1);
    } catch (error) {
      console.error("Failed to redo send backward operation:", error);
      throw error;
    }
  }
}
