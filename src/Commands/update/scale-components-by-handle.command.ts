import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { HandlePosition } from "~/Model/decorators/selected-component.decorator";

export class ScaleComponentsByHandleCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private handlePosition: HandlePosition;
  private dx: number;
  private dy: number;
  private validIds: number[] = [];

  constructor(componentManager: ComponentManager, componentIds: number[], handlePosition: HandlePosition, dx: number, dy: number) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
    this.handlePosition = handlePosition;
    this.dx = dx;
    this.dy = dy;
  }

  execute(): void {
    try {
      const uniqueIds = [...new Set(this.componentIds)];
      this.validIds = uniqueIds.filter((id) => this.componentManager.findComponentById(id) !== undefined);

      this.componentManager.scaleByHandle(this.validIds, this.handlePosition, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to execute scale by handle operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.scaleByHandle(this.validIds, this.handlePosition, -this.dx, -this.dy);
    } catch (error) {
      console.error("Failed to undo scale by handle operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.scaleByHandle(this.validIds, this.handlePosition, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to redo scale by handle operation:", error);
      throw error;
    }
  }
}
