import { CanvasView } from "./View/canvasView";
import { ToolbarView } from "./View/toolbarView";
import { PropertiesPanelView } from "./View/propertiesPanelView";
import { CanvasViewModel } from "./ViewModel/canvasViewModel";
import { ToolType } from "./ViewModel/tools/ToolType";

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
  canvasContainer.style.width = "800px";
  canvasContainer.style.height = "600px";
  canvasContainer.style.border = "1px solid #ddd";
  editorContainer.appendChild(canvasContainer);

  // 속성 패널 컨테이너
  const propertiesContainer = document.createElement("div");
  propertiesContainer.id = "properties-container";
  propertiesContainer.style.width = "250px";
  propertiesContainer.style.height = "600px";
  propertiesContainer.style.border = "1px solid #ddd";
  editorContainer.appendChild(propertiesContainer);

  // ViewModel 생성
  const canvasViewModel = new CanvasViewModel();

  // 각 View 생성
  const toolbarView = new ToolbarView(toolbarContainer, canvasViewModel);
  const canvasView = new CanvasView(canvasContainer, 800, 600, canvasViewModel);
  const propertiesPanelView = new PropertiesPanelView(
    propertiesContainer,
    canvasViewModel
  );

  canvasViewModel.subscribe(canvasView);
  canvasViewModel.subscribe(toolbarView);
  canvasViewModel.subscribe(propertiesPanelView);
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
