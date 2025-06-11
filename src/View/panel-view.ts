import { EditorState } from "~/ViewModel/editor-state";
import { Subscriber } from "~/Utils/subscriber.interface";

export class PropertyPanelView implements Subscriber<null> {
  private editorState: EditorState;

  // DOM 요소
  private noSelectionElement: HTMLElement;
  private componentPropertiesElement: HTMLElement;

  // 속성 입력 필드
  private xInput: HTMLInputElement;
  private yInput: HTMLInputElement;
  private widthInput: HTMLInputElement;
  private heightInput: HTMLInputElement;

  constructor() {
    this.editorState = EditorState.getInstance();

    // DOM 요소 참조 가져오기
    this.noSelectionElement = document.getElementById("no-selection") as HTMLElement;
    this.componentPropertiesElement = document.getElementById("component-properties") as HTMLElement;

    this.xInput = document.getElementById("prop-x") as HTMLInputElement;
    this.yInput = document.getElementById("prop-y") as HTMLInputElement;
    this.widthInput = document.getElementById("prop-width") as HTMLInputElement;
    this.heightInput = document.getElementById("prop-height") as HTMLInputElement;

    // 이벤트 리스너 설정
    this.setupEventListeners();

    // EditorState에 구독
    this.editorState.subscribe(this);

    // 초기 상태 업데이트
    this.update();
  }

  // EditorState가 변경되면 호출됨
  public update(): void {
    const selectedComponents = this.editorState.getSelectedComponents();

    if (selectedComponents.length === 0) {
      // 선택된 컴포넌트가 없을 때
      this.noSelectionElement.style.display = "block";
      this.componentPropertiesElement.style.display = "none";
    } else if (selectedComponents.length === 1) {
      // 단일 컴포넌트가 선택됐을 때
      const component = selectedComponents[0];

      this.noSelectionElement.style.display = "none";
      this.componentPropertiesElement.style.display = "block";

      // 속성 필드 업데이트
      this.xInput.value = component.bound.x.toString();
      this.yInput.value = component.bound.y.toString();
      this.widthInput.value = component.bound.width.toString();
      this.heightInput.value = component.bound.height.toString();
    } else {
      // 여러 컴포넌트가 선택됐을 때
      this.noSelectionElement.style.display = "none";
      this.componentPropertiesElement.style.display = "block";

      // 필드를 비워두거나 특별한 처리를 할 수 있음
      this.xInput.value = "";
      this.yInput.value = "";
      this.widthInput.value = "";
      this.heightInput.value = "";
    }
  }

  private setupEventListeners(): void {
    // X, Y 위치 변경
    this.xInput.addEventListener("change", () => {
      this.handlePropertiesChange();
    });

    this.yInput.addEventListener("change", () => {
      this.handlePropertiesChange();
    });

    // 너비, 높이 변경
    this.widthInput.addEventListener("change", () => {
      this.handlePropertiesChange();
    });

    this.heightInput.addEventListener("change", () => {
      this.handlePropertiesChange();
    });
  }

  private handlePropertiesChange(): void {
    const selectedComponents = this.editorState.getSelectedComponents();
    if (selectedComponents.length !== 1) return;

    const newX = parseInt(this.xInput.value);
    const newY = parseInt(this.yInput.value);
    const newWidth = parseInt(this.widthInput.value);
    const newHeight = parseInt(this.heightInput.value);

    if (!isNaN(newX) && !isNaN(newY) && !isNaN(newWidth) && !isNaN(newHeight)) {
      this.editorState.setSelectedProperties({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    }
  }
}
