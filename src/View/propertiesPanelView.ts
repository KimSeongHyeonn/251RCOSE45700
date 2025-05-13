import { PropertyEditorFactory } from "~/Model/properties/PropertyEditorFactory";
import {
  PropertiesPanelViewModel,
  PropertyChangeEvent,
} from "~/ViewModel/propertiesPanelViewModel";

export class PropertiesPanelView {
  private container: HTMLElement;
  private propertyEditors: Map<string, HTMLElement> = new Map();

  constructor(
    container: HTMLElement,
    private viewModel: PropertiesPanelViewModel
  ) {
    this.container = container;
    this.viewModel.registerView(this);
    this.viewModel.onPropertyChanged((event: PropertyChangeEvent) => {
      this.handlePropertyChange(event);
    });
  }

  // ViewModel에서 호출되는 메서드
  public updateProperties(): void {
    this.render();
  }

  public render(): void {
    const component = this.viewModel.getSelectedComponent();
    this.container.innerHTML = "";
    this.propertyEditors.clear();

    if (!component) {
      this.renderEmptyState();
      return;
    }

    const header = document.createElement("div");
    header.className = "properties-header";

    const id = document.createElement("div");
    id.className = "component-id";
    id.textContent = `ID: ${component.id}`;
    header.appendChild(id);

    this.container.appendChild(header);

    const divider = document.createElement("hr");
    this.container.appendChild(divider);
    const propsSection = document.createElement("div");
    propsSection.className = "properties-section";

    this.addPropertyEditor("width", "number", component.width || 0);
    this.addPropertyEditor("height", "number", component.height || 0);
    this.addPropertyEditor("x", "number", component.posX);
    this.addPropertyEditor("y", "number", component.posY);
  }

  private renderEmptyState(): void {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const message = document.createElement("p");
    message.textContent = "컴포넌트를 선택하세요";
    emptyState.appendChild(message);

    this.container.appendChild(emptyState);
  }

  private addPropertyEditor(
    propertyName: string,
    propertyType: string,
    value: any
  ): void {
    const editor = PropertyEditorFactory.getEditor(propertyType);
    const editorElement = editor.createEditor(propertyName, value, (newValue) =>
      this.onPropertyValueChanged(propertyName, newValue)
    );

    editorElement.classList.add("property-row");
    this.container.appendChild(editorElement);
    this.propertyEditors.set(propertyName, editorElement);
  }

  private onPropertyValueChanged(propertyName: string, newValue: any): void {
    const component = this.viewModel.getSelectedComponent();
    if (!component) return;

    // ViewModel을 통해 속성 변경 이벤트 발생
    this.viewModel.updateProperty(component.id, propertyName, newValue);
  }

  private handlePropertyChange(event: PropertyChangeEvent): void {
    const component = this.viewModel.getSelectedComponent();
    if (!component) return;

    // UI 업데이트
    const editorElement = this.propertyEditors.get(event.propertyName);
    if (editorElement) {
      const editor = PropertyEditorFactory.getEditor(
        this.getPropertyType(event.propertyName)
      );
      editor.setValue(editorElement, event.newValue);
    }
  }

  private getPropertyType(propertyName: string): string {
    // 속성 이름에 따른 타입 매핑
    const typeMap: Record<string, string> = {
      width: "number",
      height: "number",
      x: "number",
      y: "number",
    };

    return typeMap[propertyName] || "string";
  }
}
