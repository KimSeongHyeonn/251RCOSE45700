import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManager } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";

export class DeleteComponentsCommand implements ICommand {
  private componentManager: ComponentManager;
  private componentIds: number[];
  private deletedComponents: Array<{ component: IComponent; index: number }> = [];

  constructor(componentManager: ComponentManager, componentIds: number[]) {
    this.componentManager = componentManager;
    this.componentIds = [...componentIds];
  }

  execute(): void {
    try {
      const allComponents = this.componentManager.getAllComponents();
      this.deletedComponents = [];

      const uniqueIds = [...new Set(this.componentIds)];

      for (const id of uniqueIds) {
        const component = this.componentManager.findComponentById(id);
        if (component) {
          const index = allComponents.findIndex((c) => c.id === id);
          this.deletedComponents.push({ component, index });
        }
      }

      this.componentManager.removeComponent(uniqueIds);
    } catch (error) {
      this.deletedComponents = [];
      console.error("Failed to execute multiple delete operation:", error);
      throw error;
    }
  }

  undo(): void {
    try {
      if (this.deletedComponents.length === 0) return;

      for (let i = this.deletedComponents.length - 1; i >= 0; i--) {
        const { component } = this.deletedComponents[i];
        this.componentManager.addComponent(component);
      }

      this.deletedComponents
        .slice()
        .sort((a, b) => a.index - b.index)
        .forEach(({ component, index }) => {
          const currentComponents = this.componentManager.getAllComponents();
          const currentIndex = currentComponents.findIndex((c) => c.id === component.id);

          if (currentIndex !== -1 && currentIndex !== index) {
            this.componentManager.changeComponentOrder(component.id, index);
          }
        });
    } catch (error) {
      console.error("Failed to undo multiple delete operation:", error);
      throw error;
    }
  }

  redo(): void {
    try {
      if (this.deletedComponents.length === 0) return;

      const ids = this.deletedComponents.map((item) => item.component.id);
      this.componentManager.removeComponent(ids);
    } catch (error) {
      console.error("Failed to redo multiple delete operation:", error);
      throw error;
    }
  }
}
