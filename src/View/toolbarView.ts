import { ToolType } from "~/Model/tools/ToolType";
import { ITool } from "~/Model/tools/ITool";
import { CanvasViewModel } from "~/ViewModel/canvasViewModel";
export class ToolbarView {
  private toolbar: HTMLElement;
  private viewModel: CanvasViewModel;
  private buttons: Map<ToolType, HTMLButtonElement> = new Map();

  constructor(toolbar: HTMLElement, viewModel: CanvasViewModel) {
    this.toolbar = toolbar;
    this.viewModel = viewModel;

    this.createToolbar();
    this.viewModel.registerToolbarView(this);
  }

  private createToolbar(): void {
    this.toolbar.className += " toolbar";
    this.toolbar.style.display = "flex";
    this.toolbar.style.flexDirection = "column";
    this.toolbar.style.padding = "10px";
    this.toolbar.style.backgroundColor = "#f0f0f0";
    this.toolbar.style.minHeight = "40px";
    this.toolbar.style.gap = "10px";
    this.toolbar.style.justifyContent = "center";

    const tools = this.viewModel.getAllTools();

    tools.forEach((tool) => {
      this.createToolButton(tool.type, tool.label);
    });
  }

  private createToolButton(toolType: ToolType, label: string): void {
    const button = document.createElement("button");

    button.style.width = "100px";
    button.style.height = "100px";

    const labelSpan = document.createElement("span");
    labelSpan.textContent = label;
    button.appendChild(labelSpan);

    button.className = "tool-button";
    button.addEventListener("click", () => {
      this.viewModel.setTool(toolType);
    });

    this.buttons.set(toolType, button);

    this.toolbar.appendChild(button);
  }

  public updateSelectedTool(selectedTool: ToolType): void {
    this.buttons.forEach((button) => {
      button.classList.remove("selected");
      button.style.backgroundColor = "#fff";
    });

    const selectedButton = this.buttons.get(selectedTool);
    if (selectedButton) {
      selectedButton.classList.add("selected");
      selectedButton.style.backgroundColor = "#e0e0ff";
    }
  }

  public render(tools: ITool[]): void {
    this.toolbar.innerHTML = "";
    this.buttons.clear();

    tools.forEach((tool) => {
      this.createToolButton(tool.type, tool.label);
    });

    // 현재 선택된 도구 상태를 반영
    const currentTool = this.viewModel.getCurrentTool();
    if (currentTool) {
      this.updateSelectedTool(currentTool.type);
    }
  }
}
