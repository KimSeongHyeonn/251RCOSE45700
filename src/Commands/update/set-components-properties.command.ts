import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { Bound } from "~/Model/types/component.type";

export class SetComponentsPropertiesCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private newProperties: Partial<Bound>;
  private originalProperties: Array<{ id: number; properties: Partial<Bound> }> = [];

  constructor(componentManager: ComponentManager, componentIds: number[], properties: Partial<Bound>) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
    this.newProperties = { ...properties };
  }

  execute(): void {
    try {
      const uniqueIds = [...new Set(this.componentIds)];

      this.originalProperties = [];
      for (const id of uniqueIds) {
        const component = this.componentManager.findComponentById(id);
        if (component) {
          const originalProps: Partial<Bound> = {};
          if (this.newProperties.x !== undefined) originalProps.x = component.bound.x;
          if (this.newProperties.y !== undefined) originalProps.y = component.bound.y;
          if (this.newProperties.width !== undefined) originalProps.width = component.bound.width;
          if (this.newProperties.height !== undefined) originalProps.height = component.bound.height;

          this.originalProperties.push({ id, properties: originalProps });
        }
      }

      this.componentManager.setProperties(uniqueIds, this.newProperties);
    } catch (error) {
      console.error("Failed to execute multiple set property operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.originalProperties.length === 0) return;

      for (const { id, properties } of this.originalProperties) {
        if (Object.keys(properties).length > 0) {
          this.componentManager.setProperties(id, properties);
        }
      }
    } catch (error) {
      console.error("Failed to undo multiple set property operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (this.originalProperties.length === 0) return;

      const ids = this.originalProperties.map((item) => item.id);
      this.componentManager.setProperties(ids, this.newProperties);
    } catch (error) {
      console.error("Failed to redo multiple set property operation:", error);
      throw error;
    }
  }
}
