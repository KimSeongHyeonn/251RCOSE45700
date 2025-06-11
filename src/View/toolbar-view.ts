import { EditorState } from "~/ViewModel/editor-state";
import { Subscriber } from "~/Utils/subscriber.interface";
import { ToolType } from "~/ViewModel/tools/types/tool.type";

export class ToolbarView implements Subscriber<null> {
  private editorState: EditorState;
  private toolButtons: Record<ToolType, HTMLElement>;

  constructor() {
    this.editorState = EditorState.getInstance();

    // 툴 버튼 요소들 참조 가져오기
    this.toolButtons = {
      select: document.getElementById("select-tool") as HTMLElement,
      rectangle: document.getElementById("rectangle-tool") as HTMLElement,
      ellipse: document.getElementById("ellipse-tool") as HTMLElement,
      line: document.getElementById("line-tool") as HTMLElement,
      group: document.getElementById("group-tool") as HTMLElement,
      ungroup: document.getElementById("ungroup-tool") as HTMLElement,
      delete: document.getElementById("delete-tool") as HTMLElement,
    };

    // 버튼 이벤트 리스너 설정
    this.setupEventListeners();

    // EditorState 구독
    this.editorState.subscribe(this);

    // 초기 상태 업데이트
    this.update();
  }

  // EditorState가 변경되면 호출됨
  public update(): void {
    // 현재 선택된 도구 가져오기
    const activeTool = this.editorState.getActiveTool();

    // 모든 버튼에서 active 클래스 제거
    Object.values(this.toolButtons).forEach((button) => {
      button.classList.remove("active");
    });

    // 현재 도구에 active 클래스 추가
    if (this.toolButtons[activeTool]) {
      this.toolButtons[activeTool].classList.add("active");
    }
  }

  private setupEventListeners(): void {
    // 각 도구 버튼에 클릭 이벤트 연결
    Object.entries(this.toolButtons).forEach(([toolType, button]) => {
      button.addEventListener("click", () => {
        const type = toolType as ToolType;

        this.handleAction(type);
      });
    });
  }

  private handleAction(toolType: ToolType): void {
    switch (toolType) {
      case "group":
        this.editorState.groupSelected();
        break;
      case "ungroup":
        this.editorState.ungroupSelected();
        break;
      case "delete":
        this.editorState.deleteSelected();
        break;
      default:
        // 일반 도구는 활성 도구 변경
        this.editorState.setActiveTool(toolType);
        break;
    }
  }
}
