import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { Group } from "~/Model/objects/group.object";

export class UngroupComponentCommand implements ICommand {
  private componentManager: ComponentManager;
  private groupId: number;
  private childrenIds: number[] = [];

  constructor(componentManager: ComponentManager, groupId: number) {
    this.componentManager = componentManager;
    this.groupId = groupId;
  }

  execute(): void {
    try {
      const ungroupedComponents = this.componentManager.ungroup(this.groupId);

      this.childrenIds = ungroupedComponents.map((c) => c.id);
    } catch (error) {
      console.error("Failed to execute ungroup operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.childrenIds.length <= 1) return;

      const newGroup = this.componentManager.createGroup(this.childrenIds);

      this.groupId = newGroup.id;
    } catch (error) {
      console.error("Failed to undo ungroup operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      const ungroupedComponents = this.componentManager.ungroup(this.groupId);

      this.childrenIds = ungroupedComponents.map((c) => c.id);
    } catch (error) {
      console.error("Failed to redo ungroup operation:", error);
      throw error;
    }
  }
}
