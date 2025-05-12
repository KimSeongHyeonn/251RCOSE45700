import { ITool } from "./ITool";
import { ToolType } from "./ToolType";

export class SelectTool implements ITool {
  readonly type = ToolType.SELECT;
  readonly label = "선택";
  readonly icon = "select-icon"; // CSS 클래스 또는 아이콘 경로

  execute(context: any): void {
    // 선택 도구 실행 로직
    console.log("선택 도구 활성화");
  }
}

export class LineTool implements ITool {
  readonly type = ToolType.LINE;
  readonly label = "선";
  readonly icon = "line-icon";

  execute(context: any): void {
    // 선 그리기 도구 실행 로직
    console.log("선 도구 활성화");
  }
}

export class RectangleTool implements ITool {
  readonly type = ToolType.RECTANGLE;
  readonly label = "사각형";
  readonly icon = "rectangle-icon";

  execute(context: any): void {
    // 사각형 그리기 도구 실행 로직
    console.log("사각형 도구 활성화");
  }
}

export class EllipseTool implements ITool {
  readonly type = ToolType.ELLIPSE;
  readonly label = "타원";
  readonly icon = "ellipse-icon";

  execute(context: any): void {
    // 타원 그리기 도구 실행 로직
    console.log("타원 도구 활성화");
  }
}

export class TextTool implements ITool {
  readonly type = ToolType.TEXT;
  readonly label = "텍스트";
  readonly icon = "text-icon";

  execute(context: any): void {
    // 텍스트 도구 실행 로직
    console.log("텍스트 도구 활성화");
  }
}
