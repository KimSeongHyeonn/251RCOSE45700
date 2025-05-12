import { Canvas } from "./View/canvas";
import { ToolbarView } from "./View/toolbarView";
import { PropertiesPanelView } from "./View/propertiesPanelView";
import { CanvasViewModel } from "./ViewModel/canvasViewModel";

function initializeApp() {
  // 전체 에디터 컨테이너 생성
  const editorContainer = document.createElement("div");
  editorContainer.className = "editor-container";
  document.body.appendChild(editorContainer);

  // 툴바 컨테이너
  const toolbarContainer = document.createElement("div");
  toolbarContainer.id = "toolbar-container";
  editorContainer.appendChild(toolbarContainer);

  // 메인 레이아웃 컨테이너
  const mainContainer = document.createElement("div");
  mainContainer.className = "main-container";
  mainContainer.style.display = "flex";
  mainContainer.style.flexGrow = "1";
  editorContainer.appendChild(mainContainer);

  // 캔버스 컨테이너
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  canvasContainer.className = "canvas-container";
  mainContainer.appendChild(canvasContainer);

  // 속성 패널 컨테이너
  const propertiesContainer = document.createElement("div");
  propertiesContainer.id = "properties-container";
  mainContainer.appendChild(propertiesContainer);

  // ViewModel 생성
  const viewModel = new CanvasViewModel();

  // 각 View 생성
  const canvasView = new Canvas(canvasContainer, 800, 600, viewModel);
  const toolbarView = new ToolbarView(toolbarContainer, viewModel);
  const propertiesView = new PropertiesPanelView(
    propertiesContainer,
    viewModel
  );

  // 초기 렌더링
  //viewModel.initialize();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
