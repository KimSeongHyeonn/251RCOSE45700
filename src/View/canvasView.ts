import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { CanvasViewModel, ToolType } from "~/ViewModel/canvasViewModel";
import { Drawer } from "~/ViewModel/drawer";

export class CanvasView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewModel: CanvasViewModel;
  private drawer: Drawer;

  constructor(
    container: HTMLElement,
    width: number,
    height: number,
    viewModel: CanvasViewModel
  ) {
    // 캔버스 동적 생성
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;
    this.viewModel = viewModel;

    this.initEventListeners();
    this.viewModel.registerCanvasView(this);

    this.drawer = new Drawer(this.ctx);
  }

  /**
   * 마우스 이벤트에서 캔버스 상의 좌표를 계산합니다.
   * @param e 마우스 이벤트
   * @returns 캔버스 내의 x, y 좌표
   */
  private getCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private initEventListeners(): void {
    // 클릭 이벤트 - 현재 선택된 도구에 따라 컴포넌트 생성
    this.canvas.addEventListener("click", (e) => {
      const { x, y } = this.getCanvasCoordinates(e);
      this.viewModel.onClick({
        x: x,
        y: y,
      });
    });

    // 마우스 이동 이벤트 - 드래그 처리 등을 위해 필요할 경우
    this.canvas.addEventListener("mousemove", (e) => {
      const { x, y } = this.getCanvasCoordinates(e);
      // 필요한 경우 여기에 드래그 로직 추가
    });

    // 마우스 업 이벤트 - 드래그 종료 등을 위해 필요할 경우
    this.canvas.addEventListener("mouseup", (e) => {
      const { x, y } = this.getCanvasCoordinates(e);
      // 필요한 경우 여기에 드래그 완료 로직 추가
    });
  }

  // ViewModel이 호출할 렌더링 메서드
  public render(drawables: DrawableShape[]): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawer.draw(drawables);
  }
}
