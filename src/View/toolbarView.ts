import { ToolbarViewModel } from "~/ViewModel/toolbarViewModel";
import { ToolType } from "~/Model/tools/ToolType";
import { ITool } from "~/Model/tools/ITool";

export class ToolbarView {
  private toolbar: HTMLElement;
  private viewModel: ToolbarViewModel;
  private buttons: Map<ToolType, HTMLButtonElement> = new Map();

  constructor(toolbar: HTMLElement, viewModel: ToolbarViewModel) {
    this.toolbar = toolbar;
    this.viewModel = viewModel;
    this.createToolbar();
    this.viewModel.registerView(this);
  }

  private createToolbar(): void {
    this.toolbar.className += " toolbar";
    this.toolbar.style.display = "flex";
    this.toolbar.style.flexDirection = "column";
    this.toolbar.style.padding = "10px";
    this.toolbar.style.backgroundColor = "#f0f0f0";
    this.toolbar.style.borderBottom = "1px solid #ddd";
    this.toolbar.style.minHeight = "40px";

    const tools = this.viewModel.getAllTools();

    tools.forEach((tool) => {
      this.createToolButton(tool.type, tool.label, tool.icon);
    });
  }

  private createToolButton(
    toolType: ToolType,
    label: string,
    iconClass?: string
  ): void {
    const button = document.createElement("button");

    button.style.width = "100px";
    button.style.height = "100px";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "3px";
    button.style.backgroundColor = "#fff";

    if (iconClass) {
      const icon = document.createElement("span");
      icon.className = iconClass;
      button.appendChild(icon);
    }

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
    tools.forEach((tool) => {
      this.createToolButton(tool.type, tool.label, tool.icon);
    });
  }
}
