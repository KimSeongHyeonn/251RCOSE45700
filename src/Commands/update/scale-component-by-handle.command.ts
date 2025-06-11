import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { HandlePosition } from "~/Model/decorators/selected-component.decorator";

export class ScaleComponentByHandleCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private handlePosition: HandlePosition;
  private dx: number;
  private dy: number;

  constructor(componentManager: ComponentManager, componentId: number, handlePosition: HandlePosition, dx: number, dy: number) {
    this.componentManager = componentManager;
    this.componentId = componentId;
    this.handlePosition = handlePosition;
    this.dx = dx;
    this.dy = dy;
  }

  execute(): void {
    try {
      this.componentManager.scaleByHandle(this.componentId, this.handlePosition, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to execute scale by handle operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      this.componentManager.scaleByHandle(this.componentId, this.handlePosition, -this.dx, -this.dy);
    } catch (error) {
      console.error("Failed to undo scale by handle operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.scaleByHandle(this.componentId, this.handlePosition, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to redo scale by handle operation:", error);
      throw error;
    }
  }
}
