import {
  ComponentMetadata,
  PropertyMetadata,
} from "~/Model/components/ComponentMetadata";
import { IComponent } from "~/Model/interfaces/component.interface";
import { EventEmitter } from "~/Utils/eventEmitter";

export interface PropertyChangeEvent {
  componentId: number;
  propertyName: string;
  newValue: any;
}

export class PropertiesPanelViewModel {
  private selectedComponent: IComponent | null = null;
  private propertyChangeEmitter = new EventEmitter<PropertyChangeEvent>();
  private views: Set<any> = new Set();

  constructor({ testComponent }: { testComponent: IComponent }) {
    this.selectedComponent = testComponent;
  }

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

  public updateProperty(
    componentId: number,
    propertyName: string,
    newValue: any
  ): void {
    if (!this.selectedComponent) return;

    // 컴포넌트 속성 업데이트
    (this.selectedComponent as any)[propertyName] = newValue;

    // 이벤트 발생
    this.propertyChangeEmitter.emit("propertyChanged", {
      componentId,
      propertyName,
      newValue,
    });
  }
}
