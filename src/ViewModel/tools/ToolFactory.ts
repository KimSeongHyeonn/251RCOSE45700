import { ITool } from "./ITool";
import {
  SelectTool,
  LineTool,
  RectangleTool,
  EllipseTool,
  TextTool,
} from "./Tools";
import { ToolType } from "./ToolType";

export class ToolFactory {
  private static tools: Map<ToolType, ITool> = new Map<ToolType, ITool>([
    [ToolType.SELECT, new SelectTool()],
    [ToolType.LINE, new LineTool()],
    [ToolType.RECTANGLE, new RectangleTool()],
    [ToolType.ELLIPSE, new EllipseTool()],
    [ToolType.TEXT, new TextTool()],
  ]);

  public static getTool(type: ToolType): ITool {
    const tool = this.tools.get(type);
    if (!tool) {
      throw new Error(`도구 유형 ${type}에 대한 구현이 없습니다.`);
    }
    return tool;
  }

  public static getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }
}
