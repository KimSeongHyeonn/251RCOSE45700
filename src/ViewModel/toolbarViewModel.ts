import { ToolbarView } from "~/View/toolbarView";
import { ToolFactory } from "~/Model/tools/ToolFactory";
import { ToolType } from "~/Model/tools/ToolType";
import { ITool } from "~/Model/tools/ITool";

export class ToolbarViewModel {
  private view: ToolbarView | null = null;
  private currentTool: ITool;
  private tools: ITool[];

  constructor() {
    this.tools = ToolFactory.getAllTools();
    this.currentTool = ToolFactory.getTool(ToolType.SELECT); // 기본 도구
  }

  // View 등록
  public registerView(view: ToolbarView): void {
    this.view = view;
    // 초기 상태 업데이트
    this.notifyToolChanged();
  }

  public setTool(toolType: ToolType): void {
    const tool = ToolFactory.getTool(toolType);
    this.currentTool = tool;

    // 도구의 execute 메소드 실행
    tool.execute(null); // 컨텍스트는 필요에 따라 전달

    // View에 알림
    this.notifyToolChanged();
  }

  public getCurrentTool(): ITool {
    return this.currentTool;
  }

  public getAllTools(): ITool[] {
    return this.tools;
  }

  private notifyToolChanged(): void {
    if (this.view) {
      this.view.updateSelectedTool(this.currentTool.type);
    }
  }
}
