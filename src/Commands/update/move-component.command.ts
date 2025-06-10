import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class MoveComponentCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private dx: number;
  private dy: number;

  constructor(componentManager: ComponentManager, componentId: number, dx: number, dy: number) {
    this.componentManager = componentManager;
    this.componentId = componentId;
    this.dx = dx;
    this.dy = dy;
  }

  execute(): void {
    try {
      this.componentManager.moveComponent(this.componentId, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to execute move operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      this.componentManager.moveComponent(this.componentId, -this.dx, -this.dy);
    } catch (error) {
      console.error("Failed to undo move operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.moveComponent(this.componentId, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to redo move operation:", error);
      throw error;
    }
  }
}
