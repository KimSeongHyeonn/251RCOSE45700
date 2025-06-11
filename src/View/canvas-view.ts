import { EditorState } from "~/ViewModel/editor-state";
import { Subscriber } from "~/Utils/subscriber.interface";
import { ComponentRenderer } from "~/View/component-renderer/component-renderer";
import { SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";

export class CanvasView implements Subscriber<null> {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private editorState: EditorState;
  private componentRenderer: ComponentRenderer;

  constructor() {
    this.canvas = document.getElementById("editor-canvas") as HTMLCanvasElement;
    const context = this.canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas 2D context를 가져올 수 없습니다.");
    }

    this.ctx = context;
    this.editorState = EditorState.getInstance();
    this.componentRenderer = new ComponentRenderer(this.ctx);

    // 캔버스 크기 설정
    this.handleResize();
    window.addEventListener("resize", this.handleResize.bind(this));

    // 마우스 이벤트 설정
    this.setupMouseEvents();

    // 키보드 이벤트 설정
    this.setupKeyboardEvents();

    // EditorState 구독
    this.editorState.subscribe(this);
  }

  // EditorState 변경 시 호출됨
  public update(): void {
    this.render();
  }

  private handleResize(): void {
    const container = this.canvas.parentElement as HTMLElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.render();
  }

  private setupMouseEvents(): void {
    // 마우스 이벤트 설정 (mousedown, mousemove, mouseup)
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.canvas.addEventListener("mouseleave", this.handleMouseUp.bind(this));
  }

  private handleMouseDown(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isCtrlPressed = e.ctrlKey;

    this.editorState.handleMouseDown(x, y, isCtrlPressed);
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.editorState.handleMouseMove(x, y);
  }

  private handleMouseUp(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.editorState.handleMouseUp(x, y);
  }

  private setupKeyboardEvents(): void {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // 입력 필드에서 키 이벤트가 발생한 경우는 무시
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isCtrlPressed = e.ctrlKey;
    const isShiftPressed = e.shiftKey;

    switch (e.key) {
      case "Delete":
        e.preventDefault();
        this.editorState.deleteSelected();
        break;

      case "z":
        e.preventDefault();
        if (isCtrlPressed) {
          this.editorState.undo();
        }
        break;

      case "y":
        e.preventDefault();
        if (isCtrlPressed) {
          this.editorState.redo();
        }
        break;

      case "g":
        e.preventDefault();
        if (isCtrlPressed) {
          if (!isShiftPressed) {
            this.editorState.groupSelected();
          } else {
            this.editorState.ungroupSelected();
          }
        }
        break;

      case "ArrowLeft":
        e.preventDefault();
        // 왼쪽 화살표: 선택한 요소 왼쪽으로 이동
        if (e.ctrlKey) {
          // Ctrl+화살표: 1px 이동
          this.editorState.moveSelected(-1, 0);
        } else {
          // 일반 화살표: 10px 이동
          this.editorState.moveSelected(-10, 0);
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        // 오른쪽 화살표: 선택한 요소 오른쪽으로 이동
        if (e.ctrlKey) {
          this.editorState.moveSelected(1, 0);
        } else {
          this.editorState.moveSelected(10, 0);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        // 위쪽 화살표: 선택한 요소 위로 이동
        if (e.ctrlKey) {
          this.editorState.moveSelected(0, -1);
        } else {
          this.editorState.moveSelected(0, -10);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        // 아래쪽 화살표: 선택한 요소 아래로 이동
        if (e.ctrlKey) {
          this.editorState.moveSelected(0, 1);
        } else {
          this.editorState.moveSelected(0, 10);
        }
        break;
    }
  }

  private render(): void {
    // 캔버스 지우기
    this.componentRenderer.clear(this.canvas.width, this.canvas.height);

    // 모든 컴포넌트 가져오기
    const components = this.editorState.getAllComponents();

    // 한 번에 모든 컴포넌트 렌더링 (Z-order 적용됨)
    this.componentRenderer.renderComponents(components);

    // 선택된 컴포넌트의 핸들 그리기
    const selectedComponents = this.editorState.getSelectedComponents();
    for (const component of selectedComponents) {
      this.renderHandles(component);
    }
  }

  private renderHandles(component: SelectedComponentDecorator): void {
    // 선택 상자 그리기 (점선)
    const bound = component.bound;
    this.ctx.strokeStyle = "#0099ff";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(bound.x, bound.y, bound.width, bound.height);
    this.ctx.setLineDash([]);

    // 핸들 그리기 - SelectedComponentDecorator의 handles 속성 직접 사용
    this.ctx.fillStyle = "#ffffff";
    this.ctx.strokeStyle = "#0099ff";
    this.ctx.lineWidth = 1;

    // 모든 핸들 직접 접근해서 그리기
    for (const handle of (component as any).handles) {
      const halfSize = handle.size / 2;

      // 핸들 그리기 (흰색 박스 + 파란색 테두리)
      this.ctx.fillRect(handle.x - halfSize, handle.y - halfSize, handle.size, handle.size);
      this.ctx.strokeRect(handle.x - halfSize, handle.y - halfSize, handle.size, handle.size);
    }
  }
}
