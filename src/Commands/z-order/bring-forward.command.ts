import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class BringForwardCommand implements ICommand {
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

      if (this.originalIndex === allComponents.length - 1) {
        console.warn(`Component with ID ${this.componentId} is already at the front`);
        return;
      }

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex + 1);
    } catch (error) {
      console.error("Failed to bring component forward:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.originalIndex === -1) return;

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex);
    } catch (error) {
      console.error("Failed to undo bring forward operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      const allComponents = this.componentManager.getAllComponents();
      const currentIndex = allComponents.findIndex((c) => c.id === this.componentId);

      if (currentIndex === allComponents.length - 1) return;

      this.componentManager.changeComponentOrder(this.componentId, currentIndex + 1);
    } catch (error) {
      console.error("Failed to redo bring forward operation:", error);
      throw error;
    }
  }
}
