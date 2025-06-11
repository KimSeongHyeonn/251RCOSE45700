import { EllipseTool } from "~/ViewModel/tools/ellipse-tool";
import { ITool } from "~/ViewModel/tools/interfaces/tool.interface";
import { LineTool } from "~/ViewModel/tools/line-tool";
import { RectangleTool } from "~/ViewModel/tools/rectangle-tool";
import { SelectTool } from "~/ViewModel/tools/select-tool";
import { ToolType } from "~/ViewModel/tools/types/tool.type";

export class ToolManager {
  private static instance: ToolManager;
  private tools: Map<ToolType, ITool> = new Map();
  private currentToolType: ToolType = "select";

  private constructor() {
    // 도구 인스턴스 초기화
    this.tools.set("rectangle", new RectangleTool());
    this.tools.set("ellipse", new EllipseTool());
    this.tools.set("line", new LineTool());
    this.tools.set("select", new SelectTool());
  }

  public static getInstance(): ToolManager {
    if (!ToolManager.instance) {
      ToolManager.instance = new ToolManager();
    }
    return ToolManager.instance;
  }

  public getCurrentTool(): ITool {
    const tool = this.tools.get(this.currentToolType);
    if (!tool) {
      throw new Error(`Tool not found for type: ${this.currentToolType}`);
    }
    return tool;
  }

  public getCurrentToolType(): ToolType {
    return this.currentToolType;
  }

  public setCurrentTool(toolType: ToolType): void {
    if (this.currentToolType === toolType) return;

    this.getCurrentTool().deactivate();

    this.currentToolType = toolType;

    this.getCurrentTool().activate();
  }
}
