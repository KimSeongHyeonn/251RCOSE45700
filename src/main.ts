import { CanvasView } from "~/View/canvas-view";
import { PropertyPanelView } from "~/View/panel-view";
import { ToolbarView } from "~/View/toolbar-view";

function initializeApp() {
  const canvasView = new CanvasView("editor-canvas");
  const propertyPanelView = new PropertyPanelView();
  const toolbarView = new ToolbarView();
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", initializeApp);
