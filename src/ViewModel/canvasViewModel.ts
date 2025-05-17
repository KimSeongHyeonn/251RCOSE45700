import { SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { IComponent } from "~/Model/interfaces/component.interface";
import { Ellipse } from "~/Model/objects/ellipse.object";
import { Group } from "~/Model/objects/group.object";
import { Line } from "~/Model/objects/line.object";
import { Rectangle } from "~/Model/objects/rectangle.object";
import { ITool } from "~/ViewModel/tools/ITool";
import { ToolFactory } from "~/ViewModel/tools/ToolFactory";
import { CanvasView } from "~/View/canvasView";
import { PropertiesPanelView } from "~/View/propertiesPanelView";
import { ToolbarView } from "~/View/toolbarView";
import { CommandInvoker } from "~/Commands/command-invoker";
import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { CreateRectangleCommand } from "~/Commands/create-rectangle.command";
import { CreateLineCommand } from "~/Commands/create-line.command";
import { CreateEllipseCommand } from "~/Commands/create-ellipse.command";
import { SelectCommand } from "~/Commands/select.command";
import { ClearSelectCoomand } from "~/Commands/clear-select.command";
import { MoveCommand } from "~/Commands/move.command";
import { ScaleCommand } from "~/Commands/scale.command";
import { BringToFrontCommand } from "~/Commands/bring-to-front.command";
import { SendToBackCommand } from "~/Commands/send-to-back.command";

export enum ToolType {
  SELECT,
  LINE,
  RECTANGLE,
  ELLIPSE,
  TEXT,
}

export class CanvasViewModel {
  private currentTool: ITool;
  private tools: ITool[];
  private commandInvoker: CommandInvoker;
  private componentManager: ComponentManagerModel;

  private propertiesPanelView: PropertiesPanelView | null = null;
  private toolbarView: ToolbarView | null = null;
  private canvasView: CanvasView | null = null;

  constructor() {
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
  public onClick({ x, y }: { x: number; y: number }): void {
    // 기본 크기 설정
    const defaultWidth = 100;
    const defaultHeight = 100;

    // 명령 객체 생성
    let command: ICommand;

    switch (this.currentTool.type) {
      case ToolType.SELECT:
        const component = this.componentManager.getComponentAtPoint(x, y);
        if (component) {
          command = new SelectCommand(this.componentManager, component);
        } else {
          command = new ClearSelectCoomand(this.componentManager);
        }
        break;
      case ToolType.LINE:
        command = new CreateLineCommand(this.componentManager, {
          x,
          y,
          width: defaultWidth,
          height: defaultHeight,
        });
        break;
      case ToolType.RECTANGLE:
        command = new CreateRectangleCommand(this.componentManager, {
          x,
          y,
          width: defaultWidth,
          height: defaultHeight,
        });
        break;
      case ToolType.ELLIPSE:
        command = new CreateEllipseCommand(this.componentManager, {
          x,
          y,
          width: defaultWidth,
          height: defaultHeight,
        });
        break;
      default:
        return;
    }

    // 명령 실행
    this.executeCommand(command);
  }

  // 선택된 객체 이동
  public moveSelectedComponents(dx: number, dy: number): void {
    const command = new MoveCommand(this.componentManager, dx, dy);
    this.executeCommand(command);
  }

  // 선택된 객체 크기 조절
  public resizeSelectedComponents(dw: number, dh: number): void {
    const command = new ScaleCommand(this.componentManager, 0, dw, dh);
    this.executeCommand(command);
  }

  // Z-순서 변경
  public bringToFront(): void {
    const command = new BringToFrontCommand(this.componentManager);
    this.executeCommand(command);
  }

  public sendToBack(): void {
    const command = new SendToBackCommand(this.componentManager);
    this.executeCommand(command);
  }

  // 렌더링 요청
  public render(): void {
    if (this.canvasView) {
      this.canvasView.render(this.componentManager.getAllDrawables());
    }
    if (this.toolbarView) {
      this.toolbarView.render(this.tools);
    }
    if (this.propertiesPanelView) {
      this.propertiesPanelView.render();
    }
  }

  public getSelectedComponents(): IComponent[] {
    return this.componentManager.getSelectedComponents();
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

  /**
   * 명령을 실행합니다.
   * @param command 실행할 명령
   */
  public executeCommand(command: ICommand): void {
    this.commandInvoker.executeCommand(command);
    this.render(); // 명령 실행 후 화면 갱신
  }
}
