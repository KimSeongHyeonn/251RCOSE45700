import { CreateComponentCommand } from "~/Commands/create/create-component.command";
import { ComponentManager } from "~/Model/component-manager";
import { Line } from "~/Model/objects/line.object";

export class CreateLineCommand extends CreateComponentCommand<Line> {
  private startX: number;
  private startY: number;
  private endX: number;
  private endY: number;

  constructor(componentManager: ComponentManager, startX: number, startY: number, endX: number, endY: number) {
    super(componentManager);
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  execute(): void {
    try {
      if (this.startX < 0 || this.startY < 0 || this.endX < 0 || this.endY < 0) {
        throw new Error("Invalid line coordinates");
      }

      this.createdComponent = new Line({
        startX: this.startX,
        startY: this.startY,
        endX: this.endX,
        endY: this.endY,
      });

      this.componentManager.addComponent(this.createdComponent);
    } catch (error) {
      console.error("Failed to create line:", error);
      throw error;
    }
  }
}
