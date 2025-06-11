import { EditorState } from "~/ViewModel/editor-state";
import { ITool } from "~/ViewModel/tools/interfaces/tool.interface";

export class LineTool implements ITool {
  // 임계값 상수
  private readonly MIN_LENGTH = 5; // 최소 5px 길이의 선만 생성

  // 드로잉 관련 변수
  private isDrawing = false;
  private startX = 0;
  private startY = 0;

  public activate(): void {
    // 특별한 초기화 작업 필요 없음
  }

  public handleMouseDown(editorState: EditorState, x: number, y: number, isCtrlPressed: boolean): void {
    // 그리기 시작
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;

    // 기존 선택 해제
    editorState.clearSelection();
  }

  public handleMouseMove(editorState: EditorState, x: number, y: number): void {
    // 미리보기 없는 구현에서는 마우스 이동 시 아무 작업도 하지 않음
  }

  public handleMouseUp(editorState: EditorState, x: number, y: number): void {
    if (!this.isDrawing) return;

    // 선의 길이 계산
    const dx = x - this.startX;
    const dy = y - this.startY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // 최소 길이보다 큰 경우만 선 생성
    if (length >= this.MIN_LENGTH) {
      // 시작점과 끝점 전달
      editorState.createLine(this.startX, this.startY, x, y);
    }

    // 그리기 상태 초기화
    this.isDrawing = false;
  }

  public deactivate(): void {
    // 활성 상태 초기화
    this.isDrawing = false;
  }
}
