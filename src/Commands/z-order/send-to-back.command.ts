import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";

export class SendToBackCommand implements ICommand {
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

      this.componentManager.sendToBack(this.componentId);
    } catch (error) {
      console.error("Failed to send component to back:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.originalIndex === -1) return;

      this.componentManager.changeComponentOrder(this.componentId, this.originalIndex);
    } catch (error) {
      console.error("Failed to undo send to back operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.sendToBack(this.componentId);
    } catch (error) {
      console.error("Failed to redo send to back operation:", error);
      throw error;
    }
  }
}
