import { PropertiesPanelViewModel } from "~/ViewModel/propertiesPanelViewModel";
import { PropertyEditorFactory } from "~/Model/properties/PropertyEditorFactory";
import { ComponentMetadata } from "~/Model/components/ComponentMetadata";

export class PropertiesPanelView {
  private panel: HTMLElement;
  private viewModel: PropertiesPanelViewModel;
  private editorElements: Map<string, HTMLElement> = new Map();

  constructor(panel: HTMLElement, viewModel: PropertiesPanelViewModel) {
    this.panel = panel;
    this.viewModel = viewModel;
    this.createPanel();
    this.viewModel.registerView(this);
  }

  private createPanel(): void {
    this.panel.className += " properties-panel";
    this.panel.style.padding = "10px";
    this.panel.style.backgroundColor = "#f5f5f5";
    this.panel.style.border = "1px solid #ddd";
    this.panel.style.minWidth = "200px";

    const header = document.createElement("h3");
    header.textContent = "속성";
    header.style.margin = "0 0 10px 0";
    header.style.padding = "0 0 5px 0";
    header.style.borderBottom = "1px solid #ddd";

    this.panel.appendChild(header);

    const content = document.createElement("div");
    content.className = "properties-content";
    this.panel.appendChild(content);
  }

  public updateProperties(): void {
    const content = this.panel.querySelector(
      ".properties-content"
    ) as HTMLElement;
    if (!content) return;

    content.innerHTML = "";
    this.editorElements.clear();

    const component = this.viewModel.getSelectedComponent();
    if (!component) {
      const message = document.createElement("p");
      message.textContent = "선택된 컴포넌트가 없습니다";
      message.style.color = "#999";
      content.appendChild(message);
      return;
    }

    // 컴포넌트 타입 정보 표시
    const typeInfo = document.createElement("div");
    typeInfo.className = "component-type";
    typeInfo.style.marginBottom = "10px";
    typeInfo.style.fontWeight = "bold";
    content.appendChild(typeInfo);

    // 속성 목록 가져오기
    // const properties = this.viewModel.getComponentProperties();

    // 각 속성에 대해 에디터 생성
  }
}
