import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class BringToFrontCommand implements ICommand {
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

      this.componentManager.bringToFront(this.componentId);
    } catch (error) {
      console.error("Failed to bring component to front:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.originalIndex === -1) return;

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex);
    } catch (error) {
      console.error("Failed to undo bring to front operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.bringToFront(this.componentId);
    } catch (error) {
      console.error("Failed to redo bring to front operation:", error);
      throw error;
    }
  }
}
