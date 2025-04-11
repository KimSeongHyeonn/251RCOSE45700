import { Canvas } from "./View/canvas";
import { CanvasViewModel } from "./ViewModel/canvasViewModel";

function initializeApp() {
  const container = document.getElementById("canvas-container")!;

  const viewModel = new CanvasViewModel();
  const view = new Canvas(container, 800, 600, viewModel);

  // 초기 렌더링
  view.render(viewModel.getComponents());
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
