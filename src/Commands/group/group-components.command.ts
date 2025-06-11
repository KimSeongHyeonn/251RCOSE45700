import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { Group } from "~/Model/objects/group.object";

export class GroupComponentsCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private groupId: number | null = null;

  constructor(componentManager: ComponentManager, componentIds: number[]) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
  }

  execute(): void {
    try {
      const group = this.componentManager.createGroup(this.componentIds);
      this.groupId = group.id;
    } catch (error) {
      console.error("Failed to execute group operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (!this.groupId) return;

      this.componentManager.ungroup(this.groupId);
    } catch (error) {
      console.error("Failed to undo group operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      const group = this.componentManager.createGroup(this.componentIds);
      this.groupId = group.id;
    } catch (error) {
      console.error("Failed to redo group operation:", error);
      throw error;
    }
  }
}
