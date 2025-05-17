import { SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { Group } from "~/Model/objects/group.object";

export class ComponentManagerModel {
  private static instance: ComponentManagerModel;

  private _components: IComponent[] = [];
  private _selectedIds: Set<number> = new Set();

  private constructor() {}

  public static getInstance(): ComponentManagerModel {
    if (!ComponentManagerModel.instance) {
      ComponentManagerModel.instance = new ComponentManagerModel();
    }
    return ComponentManagerModel.instance;
  }

  public addComponent(component: IComponent): void {
    this._components.push(component);
  }

  public removeSelectedComponents(): void {
    this._components = this._components.filter(
      (component) => !this._selectedIds.has(component.id)
    );
    this._selectedIds.clear();
  }

  public groupSelectedComponents(): Group | null {
    const selectedComponents = this._components.filter((c) =>
      this._selectedIds.has(c.id)
    );

    if (selectedComponents.length <= 1) {
      return null;
    }

    const newGroup = new Group({ components: selectedComponents });
    this._components = this._components.filter(
      (c) => !this._selectedIds.has(c.id)
    );
    this._components.push(newGroup);

    this._selectedIds.clear();
    this._selectedIds.add(newGroup.id);

    return newGroup;
  }

  public ungroupSelectedComponents(): boolean {
    if (this._selectedIds.size !== 1) {
      return false;
    }

    const selectedId = Array.from(this._selectedIds)[0];
    const selectedComponent = this._components.find((c) => c.id === selectedId);

    if (!selectedComponent || selectedComponent.type !== "Group") {
      return false;
    }

    const group = selectedComponent as Group;
    const childComponents = group.getChildren();

    if (childComponents.length === 0) {
      return false;
    }

    this._components = this._components.filter((c) => c.id !== selectedId);
    this._components.push(...childComponents);

    this._selectedIds.clear();
    childComponents.forEach((child) => {
      this._selectedIds.add(child.id);
    });

    return true;
  }

  public bringSelectedToFront(): void {
    if (this._selectedIds.size === 0) return;

    const selectedComponents: IComponent[] = [];
    const nonSelectedComponents: IComponent[] = [];

    for (const comp of this._components) {
      if (this._selectedIds.has(comp.id)) {
        selectedComponents.push(comp);
      } else {
        nonSelectedComponents.push(comp);
      }
    }

    this._components = [...nonSelectedComponents, ...selectedComponents];
  }

  public sendSelectedToBack(): void {
    if (this._selectedIds.size === 0) return;

    const selectedComponents: IComponent[] = [];
    const nonSelectedComponents: IComponent[] = [];

    for (const comp of this._components) {
      if (this._selectedIds.has(comp.id)) {
        selectedComponents.push(comp);
      } else {
        nonSelectedComponents.push(comp);
      }
    }

    this._components = [...selectedComponents, ...nonSelectedComponents];
  }

  public selectComponent(componentId: number): void {
    const component = this._components.find((c) => c.id === componentId);
    if (component && !this._selectedIds.has(component.id)) {
      this._selectedIds.add(component.id);
    }
  }

  public selectComponents(componentIds: number[]): void {
    componentIds.forEach((id) => {
      this.selectComponent(id);
    });
  }

  public deselectComponent(componentId: number): void {
    if (this._selectedIds.has(componentId)) {
      this._selectedIds.delete(componentId);
    }
  }

  public clearSelection(): void {
    this._selectedIds.clear();
  }

  public getSelectedComponents(): SelectedComponentDecorator {
    return new SelectedComponentDecorator(
      new Group({
        components: this._components.filter((c) => this._selectedIds.has(c.id)),
      })
    );
  }

  public getSelectedDrawables(): DrawableShape[] {
    const selectedComponents = this.getSelectedComponents();
    return selectedComponents.toDrawable();
  }

  public getNonSelectedDrawables(): DrawableShape[] {
    const nonSelectedGroup = new Group({
      components: this._components.filter((c) => !this._selectedIds.has(c.id)),
    });
    return nonSelectedGroup.toDrawable();
  }

  public getAllDrawables(): DrawableShape[] {
    const selectedDrawables = this.getSelectedDrawables();
    const nonSelectedDrawables = this.getNonSelectedDrawables();
    return [...selectedDrawables, ...nonSelectedDrawables];
  }

  public getComponentAtPoint(x: number, y: number): IComponent | null {
    for (const component of this._components) {
      if (component.isContainPoint({ x, y })) {
        return component;
      }
    }
    return null;
  }

  /**
   * 모든 컴포넌트를 배열로 반환합니다.
   * @returns 모든 컴포넌트 배열
   */
  public getAllComponents(): IComponent[] {
    return [...this._components];
  }
}
