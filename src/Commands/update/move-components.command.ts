import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class MoveComponentsCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private dx: number;
  private dy: number;
  private validIds: number[] = [];

  constructor(componentManager: ComponentManager, componentIds: number[], dx: number, dy: number) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
    this.dx = dx;
    this.dy = dy;
  }

  execute(): void {
    try {
      const uniqueIds = [...new Set(this.componentIds)];
      this.validIds = uniqueIds.filter((id) => this.componentManager.findComponentById(id) !== undefined);

      this.componentManager.moveComponent(uniqueIds, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to execute multiple move operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.moveComponent(this.validIds, -this.dx, -this.dy);
    } catch (error) {
      console.error("Failed to undo multiple move operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.moveComponent(this.validIds, this.dx, this.dy);
    } catch (error) {
      console.error("Failed to redo multiple move operation:", error);
      throw error;
    }
  }
}
