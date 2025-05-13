import { CanvasView } from "./View/canvasView";
import { ToolbarView } from "./View/toolbarView";
import { PropertiesPanelView } from "./View/propertiesPanelView";
import { CanvasViewModel } from "./ViewModel/canvasViewModel";
import { ToolbarViewModel } from "./ViewModel/toolbarViewModel";
import { PropertiesPanelViewModel } from "./ViewModel/propertiesPanelViewModel";

function initializeApp() {
  // 전체 에디터 컨테이너 생성
  const editorContainer = document.createElement("div");
  editorContainer.className = "editor-container";
  editorContainer.style.display = "flex";
  editorContainer.style.flexDirection = "row";
  editorContainer.style.width = "100%";
  editorContainer.style.height = "100%";
  document.body.appendChild(editorContainer);

  // 툴바 컨테이너
  const toolbarContainer = document.createElement("div");
  toolbarContainer.id = "toolbar-container";
  toolbarContainer.style.width = "100px";
  toolbarContainer.style.height = "600px";
  toolbarContainer.style.border = "1px solid #ddd";
  editorContainer.appendChild(toolbarContainer);

  // 캔버스 컨테이너
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  canvasContainer.className = "canvas-container";
  editorContainer.appendChild(canvasContainer);

  // 속성 패널 컨테이너
  const propertiesContainer = document.createElement("div");
  propertiesContainer.id = "properties-container";
  propertiesContainer.style.width = "250px";
  editorContainer.appendChild(propertiesContainer);

  // ViewModel 생성
  const canvasViewModel = new CanvasViewModel();
  // ViewModel 간 연결

  // 초기 렌더링
  //viewModel.initialize();
  // 초기 렌더링 (예시로 몇 개의 컴포넌트 추가)
  canvasViewModel.createComponent({ type: "rectangle", x: 100, y: 100 });
  canvasViewModel.createComponent({ type: "ellipse", x: 200, y: 200 });
  canvasViewModel.createComponent({ type: "line", x: 300, y: 300 });
  const toolbarViewModel = new ToolbarViewModel();
  const propertiesPanelViewModel = new PropertiesPanelViewModel({
    testComponent: canvasViewModel.getComponents()[0],
  });

  // 각 View 생성
  const toolbarView = new ToolbarView(toolbarContainer, toolbarViewModel);
  const canvasView = new CanvasView(canvasContainer, 800, 600, canvasViewModel);
  const propertiesPanelView = new PropertiesPanelView(
    propertiesContainer,
    propertiesPanelViewModel
  );

  canvasView.render(canvasViewModel.getComponents());
  toolbarView.render(toolbarViewModel.getAllTools());
  propertiesPanelView.render();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
