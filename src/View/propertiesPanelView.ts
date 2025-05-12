import { CanvasViewModel } from "../ViewModel/canvasViewModel";

export class PropertiesPanelView {
  private container: HTMLElement;
  private viewModel: CanvasViewModel;
  private panelElement: any;

  constructor(container: HTMLElement, viewModel: CanvasViewModel) {
    this.container = container;
    this.viewModel = viewModel;
    this.createPanel();
  }

  private createPanel(): void {
    this.panelElement = document.createElement("div");
    this.panelElement.className = "properties-panel";
    this.panelElement.innerHTML =
      '<h3>Properties</h3><div class="properties-content"></div>';
    this.container.appendChild(this.panelElement);
  }
}
