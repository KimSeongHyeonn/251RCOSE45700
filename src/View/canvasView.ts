import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { Subscriber } from "~/Utils/subscriber.interface";
import { CanvasViewModel, ToolType } from "~/ViewModel/canvasViewModel";
import { Drawer } from "~/ViewModel/drawer";

export class CanvasView implements Subscriber<null> {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewModel: CanvasViewModel;
  private drawer: Drawer;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

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
    this.canvas.draggable = true; // 드래그 가능하도록 설정
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
  private getCanvasCoordinates(e: MouseEvent | DragEvent): {
    x: number;
    y: number;
  } {
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

    // 드래그 시작 이벤트
    this.canvas.addEventListener("dragstart", (e) => {
      const { x, y } = this.getCanvasCoordinates(e);
      this.dragStartX = x;
      this.dragStartY = y;
    });

    // 드래그 중 이벤트
    this.canvas.addEventListener("drag", (e) => {
      // 드래그 중 로직이 필요하면 여기에 추가
    });

    // 드래그 종료 이벤트
    this.canvas.addEventListener("dragend", (e) => {
      const { x: dragEndX, y: dragEndY } = this.getCanvasCoordinates(e);
      this.viewModel.onDrag({
        startX: this.dragStartX,
        startY: this.dragStartY,
        endX: dragEndX,
        endY: dragEndY,
      });
    });
  }

  private render(drawables: DrawableShape[]): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawer.draw(drawables);
  }

  public update(data: null): void {
    this.render(this.viewModel.getAllDrawables());
  }
}
