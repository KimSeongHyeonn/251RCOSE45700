import { SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { IComponent } from "~/Model/interfaces/component.interface";
import { Ellipse } from "~/Model/objects/ellipse.object";
import { Group } from "~/Model/objects/group.object";
import { Line } from "~/Model/objects/line.object";
import { Rectangle } from "~/Model/objects/rectangle.object";
import { ITool } from "~/Model/tools/ITool";
import { ToolFactory } from "~/Model/tools/ToolFactory";
import { CanvasView } from "~/View/canvasView";
import { PropertiesPanelView } from "~/View/propertiesPanelView";
import { ToolbarView } from "~/View/toolbarView";
import { CommandInvoker } from "~/Commands/command-invoker";
import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { CreateRectangleCommand } from "~/Commands/create-rectangle.command";
import { CreateLineCommand } from "~/Commands/create-line.command";
import { CreateEllipseCommand } from "~/Commands/create-ellipse.command";

export enum ToolType {
  SELECT,
  LINE,
  RECTANGLE,
  ELLIPSE,
  TEXT,
}

export class CanvasViewModel {
  private components: IComponent[] = [];
  private selectedComponents: IComponent[] = [];
  private canvasView: CanvasView | null = null;
  private propertiesPanelView: PropertiesPanelView | null = null;
  private toolbarView: ToolbarView | null = null;
  private rootGroup: Group;
  private currentTool: ITool;
  private tools: ITool[];
  private commandInvoker: CommandInvoker;
  private componentManager: ComponentManagerModel;

  constructor() {
    this.rootGroup = new Group({});
    this.tools = ToolFactory.getAllTools();
    this.currentTool = ToolFactory.getTool(ToolType.SELECT);
    this.setTool(ToolType.SELECT);
    this.commandInvoker = new CommandInvoker();
    this.componentManager = ComponentManagerModel.getInstance();
  }

  // View 등록
  public registerCanvasView(view: CanvasView): void {
    this.canvasView = view;
  }

  public registerPropertiesPanelView(view: PropertiesPanelView): void {
    this.propertiesPanelView = view;
  }

  public registerToolbarView(view: ToolbarView): void {
    this.toolbarView = view;
    this.notifyToolChanged();
  }

  /*
  // 캔버스 관리
  */

  // 객체 생성
  public createComponent({
    type,
    x,
    y,
  }: {
    type: ToolType;
    x: number;
    y: number;
  }): void {
    // 기본 크기 설정
    const defaultWidth = 100;
    const defaultHeight = 100;

    // 명령 객체 생성
    let command: ICommand;

    switch (type) {
      case ToolType.LINE:
        command = new CreateLineCommand(
          { x, y, width: defaultWidth, height: defaultHeight },
          this.componentManager
        );
        break;
      case ToolType.RECTANGLE:
        command = new CreateRectangleCommand(
          { x, y, width: defaultWidth, height: defaultHeight },
          this.componentManager
        );
        break;
      case ToolType.ELLIPSE:
        command = new CreateEllipseCommand(
          { x, y, width: defaultWidth, height: defaultHeight },
          this.componentManager
        );
        break;
      default:
        return;
    }

    // 명령 실행
    this.executeCommand(command);

    // 컴포넌트 매니저의 컴포넌트를 현재 컴포넌트 목록에 동기화
    this.syncComponentsFromManager();

    // 마지막으로 추가된 컴포넌트 선택
    if (this.components.length > 0) {
      this.selectedComponents = [this.components[this.components.length - 1]];
    }

    this.render();
  }

  /**
   * 컴포넌트 매니저의 컴포넌트를 현재 컴포넌트 목록에 동기화합니다.
   */
  private syncComponentsFromManager(): void {
    this.components = this.componentManager.getAllComponents();
  }

  // 객체 선택
  public selectComponentAt(
    x: number,
    y: number,
    isMultiSelect: boolean = false
  ): void {
    if (!isMultiSelect) {
      this.selectedComponents = [];
    }

    // 객체 히트 테스트 로직 구현
    // 뒤에서부터 순회하여 가장 위에 있는 컴포넌트부터 확인
    for (let i = this.components.length - 1; i >= 0; i--) {
      const component = this.components[i];
      if (component.isContainPoint({ x, y })) {
        // 이미 선택된 컴포넌트인지 확인
        const alreadySelected = this.selectedComponents.includes(component);

        if (alreadySelected && isMultiSelect) {
          // Ctrl + 클릭으로 이미 선택된 항목을 클릭한 경우 선택 해제
          this.selectedComponents = this.selectedComponents.filter(
            (c) => c !== component
          );
        } else if (!alreadySelected) {
          // 새로운 컴포넌트 선택
          this.selectedComponents.push(component);
        }

        this.render();
        return; // 첫 번째 히트된 객체만 처리
      }
    }

    // 빈 영역 클릭 시 모든 선택 해제 (멀티 선택 모드가 아닐 경우)
    if (!isMultiSelect) {
      this.selectedComponents = [];
      this.render();
    }
  }

  // 선택된 객체 이동
  public moveSelectedComponents(dx: number, dy: number): void {
    this.selectedComponents.forEach((component) => {
      component.move({ dx, dy });
    });
    this.render();
  }

  // 선택된 객체 크기 조절
  public resizeSelectedComponents(dw: number, dh: number): void {
    this.selectedComponents.forEach((component) => {
      component.scale({ width: dw, height: dh });
    });
    this.render();
  }

  // Z-순서 변경
  public bringToFront(): void {
    // 선택된 컴포넌트를 배열의 맨 뒤로 이동 (렌더링 순서가 맨 위)
    if (this.selectedComponents.length > 0) {
      const component = this.selectedComponents[0];
      this.components = this.components.filter((c) => c !== component);
      this.components.push(component);
      this.render();
    }
  }

  public sendToBack(): void {
    // 선택된 컴포넌트를 배열의 맨 앞으로 이동 (렌더링 순서가 맨 아래)
    if (this.selectedComponents.length > 0) {
      const component = this.selectedComponents[0];
      this.components = this.components.filter((c) => c !== component);
      this.components.unshift(component);
      this.render();
    }
  }

  // 렌더링 요청
  private render(): void {
    if (this.canvasView) {
      this.canvasView.render(this.components, this.selectedComponents);
    }
    if (this.toolbarView) {
      this.toolbarView.render(this.tools);
    }
    if (this.propertiesPanelView) {
      this.propertiesPanelView.render();
    }
  }

  // View에서 사용할 수 있도록 컴포넌트 목록 제공
  public getComponents(): IComponent[] {
    return this.components;
  }

  // View에서 사용할 수 있도록 선택된 컴포넌트 목록 제공
  public getSelectedComponents(): IComponent[] {
    return this.selectedComponents;
  }

  public getSelectedComponent(): IComponent {
    return this.selectedComponents[0];
  }

  /*
  // 도구 관리
  */

  public setTool(toolType: ToolType): void {
    const tool = ToolFactory.getTool(toolType);
    this.currentTool = tool;

    // 도구의 execute 메소드 실행
    tool.execute(null); // 컨텍스트는 필요에 따라 전달

    // View에 알림
    this.notifyToolChanged();
  }

  public getCurrentTool(): ITool {
    return this.currentTool;
  }

  public getAllTools(): ITool[] {
    return this.tools;
  }

  private notifyToolChanged(): void {
    if (this.toolbarView) {
      this.toolbarView.updateSelectedTool(this.currentTool.type);
    }
  }

  /*
  // 속성 패널 관리
  */
  public setSelectedComponent(component: IComponent): void {
    this.selectedComponents = [component];
    this.notifyPropertyViewUpdate();
  }

  public getPropertyValue(propertyName: string): any {
    if (!this.selectedComponents) return null;
    return (this.selectedComponents as any)[propertyName];
  }

  private notifyPropertyViewUpdate(): void {
    if (this.propertiesPanelView) {
      this.propertiesPanelView.updateProperties();
    }
  }

  /**
   * 명령을 실행합니다.
   * @param command 실행할 명령
   */
  public executeCommand(command: ICommand): void {
    this.commandInvoker.executeCommand(command);
    this.render(); // 명령 실행 후 화면 갱신
  }
}
