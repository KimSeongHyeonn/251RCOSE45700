import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { Bound } from "~/Model/types/component.type";

export class SetComponentPropertiesCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentId: number;
  private newProperties: Partial<Bound>;
  private originalProperties: Partial<Bound>;

  constructor(componentManager: ComponentManager, componentId: number, properties: Partial<Bound>) {
    this.componentManager = componentManager;
    this.componentId = componentId;
    this.newProperties = { ...properties };
    this.originalProperties = {};
  }

  execute(): void {
    try {
      const component = this.componentManager.findComponentById(this.componentId);
      if (component) {
        this.originalProperties = {};
        if (this.newProperties.x !== undefined) this.originalProperties.x = component.bound.x;
        if (this.newProperties.y !== undefined) this.originalProperties.y = component.bound.y;
        if (this.newProperties.width !== undefined) this.originalProperties.width = component.bound.width;
        if (this.newProperties.height !== undefined) this.originalProperties.height = component.bound.height;
      }

      this.componentManager.setProperties(this.componentId, this.newProperties);
    } catch (error) {
      console.error("Failed to execute set property operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (Object.keys(this.originalProperties).length === 0) return;

      this.componentManager.setProperties(this.componentId, this.originalProperties);
    } catch (error) {
      console.error("Failed to undo set property operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      this.componentManager.setProperties(this.componentId, this.newProperties);
    } catch (error) {
      console.error("Failed to redo set property operation:", error);
      throw error;
    }
  }
}
