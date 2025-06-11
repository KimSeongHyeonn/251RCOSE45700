import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class ScaleComponentsCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private sx: number;
  private sy: number;
  private validIds: number[] = [];

  constructor(componentManager: ComponentManager, componentIds: number[], sx: number, sy: number) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
    this.sx = sx;
    this.sy = sy;
  }

  execute(): void {
    try {
      const uniqueIds = [...new Set(this.componentIds)];
      this.validIds = uniqueIds.filter((id) => this.componentManager.findComponentById(id) !== undefined);

      this.componentManager.scaleComponent(this.validIds, this.sx, this.sy);
    } catch (error) {
      console.error("Failed to execute multiple scale operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.scaleComponent(this.validIds, 1 / this.sx, 1 / this.sy);
    } catch (error) {
      console.error("Failed to undo multiple scale operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (this.validIds.length === 0) return;

      this.componentManager.scaleComponent(this.validIds, this.sx, this.sy);
    } catch (error) {
      console.error("Failed to redo multiple scale operation:", error);
      throw error;
    }
  }
}
