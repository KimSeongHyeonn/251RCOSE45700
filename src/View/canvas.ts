import { IComponent } from "../Model/interfaces/component.interface";
import { CanvasViewModel } from "../ViewModel/canvasViewModel";
import { Drawer } from "../ViewModel/drawer";

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private viewModel: CanvasViewModel;
  private drawer: Drawer;

  constructor(container: HTMLElement, width: number, height: number, viewModel: CanvasViewModel) {
    // 캔버스 동적 생성
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d")!;
    this.viewModel = viewModel;

    this.initEventListeners();
    this.viewModel.registerView(this);

    this.drawer = new Drawer(this.ctx);
  }
  private initEventListeners(): void {
    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.viewModel.selectComponentAt(x, y, e.ctrlKey);
    });
  }

  // ViewModel이 호출할 렌더링 메서드
  public render(components: IComponent[], selectedComponents: IComponent[] = []): void {
    // 캔버스 초기화
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 모든 컴포넌트 그리기
    components.forEach((component) => {
      // 실제로는 각 컴포넌트 타입에 맞게 그리기 구현 필요
      this.drawer.draw(component.toDrawable());
    });

    // 선택된 컴포넌트 표시 (외곽선 등)
    this.renderSelectionIndicators(selectedComponents);
  }

  private renderSelectionIndicators(components: IComponent[]): void {
    // 선택된 객체 표시 로직 구현
    // 예: 점선 테두리, 크기 조절 핸들 등
  }
}
