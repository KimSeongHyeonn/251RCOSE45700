import { PropertyEditorFactory } from "~/Model/properties/PropertyEditorFactory";
import { CanvasViewModel } from "~/ViewModel/canvasViewModel";

export class PropertiesPanelView {
  private propertiesPanel: HTMLElement;
  private propertyEditors: Map<string, HTMLElement> = new Map();
  private viewModel: CanvasViewModel;

  constructor(propertiesPanel: HTMLElement, viewModel: CanvasViewModel) {
    this.propertiesPanel = propertiesPanel;
    this.viewModel = viewModel;
    this.viewModel.registerPropertiesPanelView(this);
  }
  public update(data: null): void {
    const components = this.viewModel.getSelectedComponents();
    if (components.length === 0) {
      this.render({
        x: "",
        y: "",
        width: "",
        height: "",
        type: "",
      });
    } else if (components.length > 1) {
      this.render({
        x: "Mixed",
        y: "Mixed",
        width: "Mixed",
        height: "Mixed",
        type: "Mixed",
      });
    } else {
      this.render({
        x: components[0].posX,
        y: components[0].posY,
        width: components[0].width,
        height: components[0].height,
        type: components[0].type,
      });
    }
  }

  private render({
    x,
    y,
    width,
    height,
    type,
  }: {
    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;
    type: string;
  }): void {
    this.propertiesPanel.innerHTML = "";
    this.propertyEditors.clear();

    const header = document.createElement("div");
    header.className = "properties-header";

    this.propertiesPanel.appendChild(header);

    const divider = document.createElement("hr");
    this.propertiesPanel.appendChild(divider);
    const propsSection = document.createElement("div");
    propsSection.className = "properties-section";

    this.addPropertyEditor("width", "number | string", width);
    this.addPropertyEditor("height", "number | string", height);
    this.addPropertyEditor("x", "number | string", x);
    this.addPropertyEditor("y", "number | string", y);
    this.addPropertyEditor("type", "string", type);
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
    this.propertiesPanel.appendChild(editorElement);
    this.propertyEditors.set(propertyName, editorElement);
  }

  private onPropertyValueChanged(propertyName: string, newValue: any): void {
    const updateData: { [key: string]: number | undefined } = {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    };
    updateData[propertyName] = newValue;
    this.viewModel.onPropertyValueChange(updateData);
  }

  private handlePropertyChange(): void {}
}
