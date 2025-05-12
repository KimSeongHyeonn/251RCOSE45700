import { ToolType } from "../ViewModel/canvasViewModel";

export class ToolbarView {
  private container: HTMLElement;
  private viewModel: any; // 실제 구현에서는 ToolbarViewModel 타입 사용
  private buttons: Map<ToolType, HTMLButtonElement> = new Map();

  constructor(container: HTMLElement, viewModel: any) {
    this.container = container;
    this.viewModel = viewModel;
    this.createToolbar();
    this.viewModel.registerToolbarView(this);
  }

  private createToolbar(): void {
    // 툴바 컨테이너 생성
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    // 도구 버튼 생성
    this.createToolButton(ToolType.SELECT, "Select");
    this.createToolButton(ToolType.LINE, "Line");
    this.createToolButton(ToolType.RECTANGLE, "Rectangle");
    this.createToolButton(ToolType.ELLIPSE, "Ellipse");

    this.container.appendChild(toolbar);
  }

  private createToolButton(toolType: ToolType, label: string): void {
    const button = document.createElement("button");
    button.textContent = label;
    button.className = "tool-button";
    button.addEventListener("click", () => {
      this.viewModel.setTool(toolType);
    });

    this.buttons.set(toolType, button);
    this.container.firstChild?.appendChild(button);
  }

  // ViewModel에서 호출하는 메서드
  public updateSelectedTool(selectedTool: ToolType): void {
    // 모든 버튼에서 'selected' 클래스 제거
    this.buttons.forEach((button) => {
      button.classList.remove("selected");
    });

    // 선택된 도구 버튼에 'selected' 클래스 추가
    const selectedButton = this.buttons.get(selectedTool);
    if (selectedButton) {
      selectedButton.classList.add("selected");
    }
  }
}
