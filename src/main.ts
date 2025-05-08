import { Canvas } from "~/View/canvas";
import { CanvasViewModel } from "~/ViewModel/canvasViewModel";

function initializeApp() {
  const container = document.getElementById("canvas-container")!;

  const viewModel = new CanvasViewModel();
  const view = new Canvas(container, 800, 600, viewModel);

  // 초기 렌더링 (예시로 몇 개의 컴포넌트 추가)
  viewModel.createComponent({ type: "rectangle", x: 100, y: 100 });
  viewModel.createComponent({ type: "ellipse", x: 200, y: 200 });
  viewModel.createComponent({ type: "line", x: 300, y: 300 });
  view.render(viewModel.getComponents());
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
