import { EditorState } from "~/ViewModel/editor-state";
import { ITool } from "~/ViewModel/tools/interfaces/tool.interface";
import { HandlePosition, SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { Bound } from "~/Model/types/component.type";

export class SelectTool implements ITool {
  // 임계값 상수 추가
  private readonly THRESHOLD = 3; // 3px

  private isDragging = false;
  private isResizing = false;
  private resizingHandle: HandlePosition | null = null;

  // 원본 상태 저장을 위한 맵
  private originalBounds: Map<SelectedComponentDecorator, Bound> = new Map();

  // 움직임 관련 변수
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private hasMoved = false; // 임계값 이상 움직였는지 추적

  public activate(): void {
    // 특별한 초기화 작업 필요 없음
  }

  public handleMouseDown(editorState: EditorState, x: number, y: number, isCtrlPressed: boolean): void {
    // 마우스 위치 저장
    this.startX = x;
    this.startY = y;
    this.lastX = x;
    this.lastY = y;
    this.hasMoved = false;

    const componentId = editorState.findComponentAt(x, y);

    if (componentId !== null) {
      // 컴포넌트 선택
      editorState.selectComponent(componentId, isCtrlPressed);

      // 선택된 모든 컴포넌트의 원본 상태 저장
      this.originalBounds.clear();
      const selectedComponents = editorState.getSelectedComponents();
      for (const component of selectedComponents) {
        this.originalBounds.set(component, { ...component.bound });
      }

      // 리사이즈 핸들 체크
      for (const component of selectedComponents) {
        const handlePos = component.getHandleAtPosition(x, y);
        if (handlePos !== null) {
          // 리사이즈 시작 - 원본 상태 저장
          this.isResizing = true;
          this.resizingHandle = handlePos;
          return;
        }
      }

      // 드래그 시작
      this.isDragging = true;
    } else {
      // 빈 공간 클릭 시 선택 해제
      editorState.clearSelection();
    }
  }

  public handleMouseMove(editorState: EditorState, x: number, y: number): void {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const totalDx = x - this.startX;
    const totalDy = y - this.startY;

    // 임계값 체크 - 총 이동거리가 임계값보다 작으면 움직임 무시
    if (!this.hasMoved && Math.abs(totalDx) < this.THRESHOLD && Math.abs(totalDy) < this.THRESHOLD) {
      // 현재 위치만 업데이트하고 실제 변경은 하지 않음
      this.lastX = x;
      this.lastY = y;
      return;
    }

    // 임계값 초과 시 hasMoved 플래그 설정
    this.hasMoved = true;

    editorState.applyTemporaryChange(() => {
      if (this.isResizing) {
        // 리사이즈 처리 - 임시로 시각적 변화만 처리
        const selectedComponents = this.originalBounds.keys();
        for (const component of selectedComponents) {
          if (this.resizingHandle) {
            component.scaleByHandle(this.resizingHandle, dx, dy);
          }
        }
      } else if (this.isDragging) {
        // 드래그 처리 - 임시로 시각적 변화만 처리
        const selectedComponents = editorState.getSelectedComponents();
        for (const component of selectedComponents) {
          component.move({ dx, dy });
        }
      }
    });

    // 현재 위치 업데이트
    this.lastX = x;
    this.lastY = y;
  }

  public handleMouseUp(editorState: EditorState, x: number, y: number): void {
    // 원래 상태로 모두 되돌리기
    editorState.applyTemporaryChange(() => {
      const selectedComponents = this.originalBounds.keys();
      for (const component of selectedComponents) {
        const origBound = this.originalBounds.get(component);
        if (origBound) {
          component.setProperties(origBound);
        }
      }
    });

    // 임계값보다 적게 움직인 경우 아무 작업도 수행하지 않음
    if (!this.hasMoved) {
      this.isResizing = false;
      this.isDragging = false;
      this.originalBounds.clear();
      return;
    }

    // 총 이동 거리 계산
    const totalDeltaX = this.lastX - this.startX;
    const totalDeltaY = this.lastY - this.startY;

    if (Math.abs(totalDeltaX) > this.THRESHOLD || Math.abs(totalDeltaY) > this.THRESHOLD) {
      if (this.isResizing && this.resizingHandle) {
        editorState.scaleSelectedByHandle(this.resizingHandle, totalDeltaX, totalDeltaY);

        this.isResizing = false;
        this.resizingHandle = null;
      } else if (this.isDragging) {
        editorState.moveSelected(totalDeltaX, totalDeltaY);

        this.isDragging = false;
      }
    }

    this.originalBounds.clear();
  }

  public deactivate(): void {
    // 상태 초기화
    this.isDragging = false;
    this.isResizing = false;
    this.hasMoved = false;
    this.originalBounds.clear();
  }
}
