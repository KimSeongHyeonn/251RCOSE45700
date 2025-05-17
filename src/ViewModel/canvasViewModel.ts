import { IComponent } from "~/Model/interfaces/component.interface";
import { ITool } from "~/ViewModel/tools/ITool";
import { ToolFactory } from "~/ViewModel/tools/ToolFactory";
import { CanvasView } from "~/View/canvasView";
import { PropertiesPanelView } from "~/View/propertiesPanelView";
import { ToolbarView } from "~/View/toolbarView";
import { CommandInvoker } from "~/Commands/command-invoker";
import { ICommand } from "~/Commands/interfaces/command.interface";
import { ComponentManagerModel } from "~/Model/component-manager";
import { MoveCommand } from "~/Commands/move.command";
import { ScaleCommand } from "~/Commands/scale.command";
import { BringToFrontCommand } from "~/Commands/bring-to-front.command";
import { SendToBackCommand } from "~/Commands/send-to-back.command";
import { Observable } from "~/Utils/observable.interface";
import { Subscriber } from "~/Utils/subscriber.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { SetPropertyCommand } from "~/Commands/set-property.command";

export enum ToolType {
  SELECT,
  LINE,
  RECTANGLE,
  ELLIPSE,
  TEXT,
}

export class CanvasViewModel implements Subscriber<null>, Observable<null> {
  private currentTool: ITool;
  private tools: ITool[];
  private commandInvoker: CommandInvoker;
  private componentManager: ComponentManagerModel;
  private observers: Subscriber<null>[] = [];

  private propertiesPanelView: PropertiesPanelView | null = null;
  private toolbarView: ToolbarView | null = null;
  private canvasView: CanvasView | null = null;

  constructor() {
    this.tools = ToolFactory.getAllTools();
    this.currentTool = ToolFactory.getTool(ToolType.SELECT);
    this.setTool(ToolType.SELECT);
    this.commandInvoker = new CommandInvoker();
    this.componentManager = ComponentManagerModel.getInstance();
    this.componentManager.subscribe(this);
  }

  // View 등록
  public registerCanvasView(view: CanvasView): void {
    this.canvasView = view;
  }

  public registerPropertiesPanelView(view: PropertiesPanelView): void {
    this.propertiesPanelView = view;
    this.propertiesPanelView.update(null);
  }

  public registerToolbarView(view: ToolbarView): void {
    this.toolbarView = view;
    this.toolbarView.update(null);
  }

  public onPropertyValueChange({
    x,
    y,
    width,
    height,
  }: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }): void {
    const command = new SetPropertyCommand(
      this.componentManager,
      x,
      y,
      width,
      height
    );
    this.executeCommand(command);
  }

  /*
  // 캔버스 관리
  */

  // 객체 생성
  public onClick({ x, y }: { x: number; y: number }): void {
    const command = this.currentTool.getCommandOnClick({
      componentManager: this.componentManager,
      x,
      y,
    });
    this.executeCommand(command);
  }

  public onDrag({
    startX,
    startY,
    endX,
    endY,
  }: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }): void {
    let command: ICommand;
    if (Math.abs(startX - endX) < 5 && Math.abs(startY - endY) < 5) {
      command = this.currentTool.getCommandOnClick({
        componentManager: this.componentManager,
        x: startX,
        y: startY,
      });
    } else {
      command = this.currentTool.getCommandOnDrag({
        componentManager: this.componentManager,
        startX,
        startY,
        endX,
        endY,
      });
    }
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

  public getSelectedComponents(): IComponent[] {
    return this.componentManager.getSelectedComponents();
  }

  /*
  // 도구 관리
  */

  public setTool(toolType: ToolType): void {
    const tool = ToolFactory.getTool(toolType);
    this.currentTool = tool;

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
      this.toolbarView.update(null);
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
  }

  public notify(): void {
    this.observers.forEach((observer) => observer.update(null));
  }

  public update(data: null): void {
    this.notify();
  }

  public subscribe(observer: Subscriber<null>): void {
    this.observers.push(observer);
  }

  public unsubscribe(observer: Subscriber<null>): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  public getAllDrawables(): DrawableShape[] {
    return this.componentManager.getAllDrawables();
  }
}
