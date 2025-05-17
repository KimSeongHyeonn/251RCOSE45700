import { ToolType } from "./ToolType";

export interface ITool {
  readonly type: ToolType;
  readonly label: string;
  readonly icon?: string;
  execute(context: any): void; // 도구가 선택됐을 때 실행할 동작
}
