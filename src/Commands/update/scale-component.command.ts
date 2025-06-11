import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class ScaleComponentCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private sx: number;
  private sy: number;

  constructor(componentManager: ComponentManager, componentId: number, sx: number, sy: number) {
    this.componentManager = componentManager;
    this.componentId = componentId;
    this.sx = sx;
    this.sy = sy;
  }

  execute(): void {
    try {
      this.componentManager.scaleComponent(this.componentId, this.sx, this.sy);
    } catch (error) {
      console.error("Failed to execute scale operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      this.componentManager.scaleComponent(this.componentId, 1 / this.sx, 1 / this.sy);
    } catch (error) {
      console.error("Failed to undo scale operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.scaleComponent(this.componentId, this.sx, this.sy);
    } catch (error) {
      console.error("Failed to redo scale operation:", error);
      throw error;
    }
  }
}
