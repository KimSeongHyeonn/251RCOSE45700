import { EditorState } from "~/ViewModel/editor-state";
import { ITool } from "~/ViewModel/tools/interfaces/tool.interface";

export class RectangleTool implements ITool {
  // 임계값 상수
  private readonly MIN_SIZE = 5; // 최소 5px 크기의 사각형만 생성

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

    // 최종 크기 계산
    const width = Math.abs(x - this.startX);
    const height = Math.abs(y - this.startY);

    // 최소 크기보다 큰 경우만 사각형 생성
    if (width >= this.MIN_SIZE && height >= this.MIN_SIZE) {
      // 좌상단 좌표 계산 (드래그 방향에 상관없이)
      const left = Math.min(this.startX, x);
      const top = Math.min(this.startY, y);

      // 사각형 생성 명령 실행
      editorState.createRectangle(left, top, width, height);
    }

    // 그리기 상태 초기화
    this.isDrawing = false;
  }

  public deactivate(): void {
    // 활성 상태 초기화
    this.isDrawing = false;
  }
}
