import { CreateComponentCommand } from "~/Commands/create/create-component.command";
import { ComponentManager } from "~/Model/component-manager";
import { Rectangle } from "~/Model/objects/rectangle.object";

export class CreateRectangleCommand extends CreateComponentCommand<Rectangle> {
  private posX: number;
  private posY: number;
  private width: number;
  private height: number;

  constructor(componentManager: ComponentManager, posX: number, posY: number, width: number, height: number) {
    super(componentManager);
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
  }

  execute(): void {
    try {
      if (this.width <= 0 || this.height <= 0) {
        throw new Error("Invalid dimensions: width and height must be positive");
      }

      this.createdComponent = new Rectangle({
        posX: this.posX,
        posY: this.posY,
        width: this.width,
        height: this.height,
      });

      this.componentManager.addComponent(this.createdComponent);
    } catch (error) {
      console.error("Failed to create rectangle:", error);
      throw error;
    }
  }
}
