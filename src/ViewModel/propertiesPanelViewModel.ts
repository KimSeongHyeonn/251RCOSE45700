import {
  ComponentMetadata,
  PropertyMetadata,
} from "~/Model/components/ComponentMetadata";
import { IComponent } from "~/Model/interfaces/component.interface";
import { PropertyEditorFactory } from "~/Model/properties/PropertyEditorFactory";
import { EventEmitter } from "~/Utils/eventEmitter";

export interface PropertyChangeEvent {
  componentId: string;
  propertyName: string;
  newValue: any;
}

export class PropertiesPanelViewModel {
  private selectedComponent: IComponent | null = null;
  private propertyChangeEmitter = new EventEmitter<PropertyChangeEvent>();
  private views: Set<any> = new Set();

  constructor() {}

  public registerView(view: any): void {
    this.views.add(view);
    this.notifyViewsUpdate();
  }

  public onPropertyChanged(
    listener: (event: PropertyChangeEvent) => void
  ): void {
    this.propertyChangeEmitter.on("propertyChanged", listener);
  }

  public setSelectedComponent(component: IComponent | null): void {
    this.selectedComponent = component;
    this.notifyViewsUpdate();
  }

  public getSelectedComponent(): IComponent | null {
    return this.selectedComponent;
  }

  public getPropertyValue(propertyName: string): any {
    if (!this.selectedComponent) return null;
    return (this.selectedComponent as any)[propertyName];
  }

  private notifyViewsUpdate(): void {
    this.views.forEach((view) => {
      view.updateProperties();
    });
  }
}
