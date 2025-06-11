import { ComponentManager } from "~/Model/component-manager";
import { IComponent } from "~/Model/interfaces/component.interface";
import { CommandInvoker } from "~/Commands/command-invoker";
import { DeleteComponentsCommand } from "~/Commands/delete/delete-components.command";
import { GroupComponentsCommand } from "~/Commands/group/group-components.command";
import { UngroupComponentCommand } from "~/Commands/group/ungroup-component.command";
import { Observable } from "~/Utils/observable.interface";
import { Subscriber } from "~/Utils/subscriber.interface";
import { HandlePosition, SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { MoveComponentsCommand } from "~/Commands/update/move-components.command";
import { ScaleComponentsCommand } from "~/Commands/update/scale-components.command";
import { CreateRectangleCommand } from "~/Commands/create/create-rectangle.command";
import { CreateEllipseCommand } from "~/Commands/create/create-ellipse.command";
import { CreateLineCommand } from "~/Commands/create/create-line.command";
import { ToolManager } from "~/ViewModel/tools/tool-manager";
import { SetComponentPropertiesCommand } from "~/Commands/update/set-component-properties";
import { Bound } from "~/Model/types/component.type";
import { ToolType } from "~/ViewModel/tools/types/tool.type";
import { ScaleComponentsByHandleCommand } from "~/Commands/update/scale-components-by-handle.command";
import { BringToFrontCommand } from "~/Commands/z-order/bring-to-front.command";
import { SendToBackCommand } from "~/Commands/z-order/send-to-back.command";
import { BringForwardCommand } from "~/Commands/z-order/bring-forward.command";
import { SendBackwardCommand } from "~/Commands/z-order/send-backward.command";

export class EditorState implements Observable<null>, Subscriber<null> {
  private static instance: EditorState;

  // 모델 레이어와 연결
  private componentManager = ComponentManager.getInstance();
  private commandInvoker = CommandInvoker.getInstance();

  // 상태 관리
  private _selectedIds: number[] = [];

  // 도구 관리
  private toolManager: ToolManager = ToolManager.getInstance();

  // 선택된 컴포넌트 데코레이터 관리
  private selectedComponents: Map<number, SelectedComponentDecorator> = new Map();

  // 옵저버 패턴
  private observers: Subscriber<null>[] = [];

  private constructor() {
    // 컴포넌트 상태 변화 구독
    this.componentManager.subscribe(this);
  }

  public static getInstance(): EditorState {
    if (!EditorState.instance) {
      EditorState.instance = new EditorState();
    }
    return EditorState.instance;
  }

  public setActiveTool(toolType: ToolType): void {
    this.toolManager.setCurrentTool(toolType);

    this.notify();
  }

  public getActiveTool(): ToolType {
    return this.toolManager.getCurrentToolType();
  }

  // 마우스 이벤트 처리 (캔버스 뷰와 연결할 메서드)
  public handleMouseDown(x: number, y: number, isCtrlPressed: boolean): void {
    this.toolManager.getCurrentTool().handleMouseDown(this, x, y, isCtrlPressed);
  }

  public handleMouseMove(x: number, y: number): void {
    this.toolManager.getCurrentTool().handleMouseMove(this, x, y);
  }

  public handleMouseUp(x: number, y: number): void {
    this.toolManager.getCurrentTool().handleMouseUp(this, x, y);
  }

  // 선택된 컴포넌트 ID 배열
  public get selectedIds(): number[] {
    return [...this._selectedIds];
  }

  // 모든 컴포넌트 가져오기
  public getAllComponents(): IComponent[] {
    return this.componentManager.getAllComponents();
  }

  // 선택된 컴포넌트 데코레이터 가져오기
  public getSelectedComponent(id: number): SelectedComponentDecorator | undefined {
    return this.selectedComponents.get(id);
  }

  public getSelectedComponents(): SelectedComponentDecorator[] {
    return Array.from(this.selectedComponents.values());
  }

  // 컴포넌트 선택
  public selectComponent(id: number, addToSelection = false): void {
    const component = this.componentManager.findComponentById(id);
    if (!component) return;

    if (!addToSelection) {
      // 다중 선택이 아닌 경우 기존 선택 해제
      this._selectedIds = [id];
    } else if (!this._selectedIds.includes(id)) {
      // 다중 선택인 경우 목록에 추가
      this._selectedIds.push(id);
    }

    this.updateSelectedComponents();
    this.notify();
  }

  // 모든 선택 해제
  public clearSelection(): void {
    if (this._selectedIds.length === 0) return;

    this._selectedIds = [];
    this.selectedComponents.clear();

    this.notify();
  }

  // 좌표에 있는 컴포넌트 찾기
  public findComponentAt(x: number, y: number): number | null {
    const component = this.componentManager.findComponentAtPoint(x, y);
    return component ? component.id : null;
  }

  // 선택된 컴포넌트 이동
  public moveSelected(dx: number, dy: number): void {
    if (this._selectedIds.length === 0) return;

    const command = new MoveComponentsCommand(this.componentManager, this._selectedIds, dx, dy);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 크기 조정
  public scaleSelected(sx: number, sy: number): void {
    if (this._selectedIds.length === 0) return;

    const command = new ScaleComponentsCommand(this.componentManager, this._selectedIds, sx, sy);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 크기 조정 (handle)
  public scaleSelectedByHandle(handlePos: HandlePosition, dx: number, dy: number): void {
    if (this._selectedIds.length === 0) return;

    const command = new ScaleComponentsByHandleCommand(this.componentManager, this._selectedIds, handlePos, dx, dy);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 속성 설정
  public setSelectedProperties(properties: Partial<Bound>): void {
    if (this._selectedIds.length !== 1) return;

    const command = new SetComponentPropertiesCommand(this.componentManager, this._selectedIds[0], properties);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 삭제
  public deleteSelected(): void {
    if (this._selectedIds.length === 0) return;

    const command = new DeleteComponentsCommand(this.componentManager, this._selectedIds);
    this.commandInvoker.executeCommand(command);

    this._selectedIds = [];
    this.selectedComponents.clear();
  }

  // 선택된 컴포넌트 그룹화
  public groupSelected(): void {
    if (this._selectedIds.length < 2) return;

    const command = new GroupComponentsCommand(this.componentManager, this._selectedIds);
    this.commandInvoker.executeCommand(command);
  }

  public isGroupable(): boolean {
    // 그룹화 가능한지 확인 (선택된 컴포넌트가 2개 이상인지)
    return this._selectedIds.length >= 2;
  }

  // 선택된 그룹 해제
  public ungroupSelected(): void {
    if (this._selectedIds.length !== 1) return;

    const componentId = this._selectedIds[0];
    const component = this.componentManager.findComponentById(componentId);

    if (component && component.type === "group") {
      const command = new UngroupComponentCommand(this.componentManager, componentId);
      this.commandInvoker.executeCommand(command);

      this._selectedIds = [];
      this.selectedComponents.clear();
    }
  }

  public isUngroupable(): boolean {
    // 선택된 컴포넌트가 그룹화 가능한지 확인
    if (this._selectedIds.length !== 1) return false;

    const componentId = this._selectedIds[0];
    const component = this.componentManager.findComponentById(componentId);
    return component ? component.type === "group" : false;
  }

  // 선택된 컴포넌트 맨앞으로
  public bringToFront(): void {
    if (this._selectedIds.length !== 1) return;

    const command = new BringToFrontCommand(this.componentManager, this._selectedIds[0]);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 한칸 앞으로
  public bringForward(): void {
    if (this._selectedIds.length !== 1) return;

    const command = new BringForwardCommand(this.componentManager, this._selectedIds[0]);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 맨뒤로
  public sendToBack(): void {
    if (this._selectedIds.length !== 1) return;
    const command = new SendToBackCommand(this.componentManager, this._selectedIds[0]);
    this.commandInvoker.executeCommand(command);
  }

  // 선택된 컴포넌트 한칸 뒤로
  public sendBackward(): void {
    if (this._selectedIds.length !== 1) return;
    const command = new SendBackwardCommand(this.componentManager, this._selectedIds[0]);
    this.commandInvoker.executeCommand(command);
  }

  public isZOrderChangeable(): boolean {
    // Z-Order 변경 가능한지 확인 (선택된 컴포넌트가 1개인지)
    return this._selectedIds.length === 1;
  }

  // 사각형 생성
  public createRectangle(x: number, y: number, width: number, height: number): number {
    const command = new CreateRectangleCommand(this.componentManager, x, y, width, height);
    this.commandInvoker.executeCommand(command);

    // 생성된 컴포넌트의 ID 반환
    const components = this.componentManager.getAllComponents();
    const newComponentId = components[components.length - 1].id;

    // 생성 후 자동 선택
    this.selectComponent(newComponentId);

    return newComponentId;
  }

  // 타원 생성
  public createEllipse(x: number, y: number, width: number, height: number): number {
    const command = new CreateEllipseCommand(this.componentManager, x, y, width, height);
    this.commandInvoker.executeCommand(command);

    // 생성된 컴포넌트의 ID 반환
    const components = this.componentManager.getAllComponents();
    const newComponentId = components[components.length - 1].id;

    // 생성 후 자동 선택
    this.selectComponent(newComponentId);

    return newComponentId;
  }

  // 선 생성
  public createLine(x1: number, y1: number, x2: number, y2: number): number {
    const command = new CreateLineCommand(this.componentManager, x1, y1, x2, y2);
    this.commandInvoker.executeCommand(command);

    // 생성된 컴포넌트의 ID 반환
    const components = this.componentManager.getAllComponents();
    const newComponentId = components[components.length - 1].id;

    // 생성 후 자동 선택
    this.selectComponent(newComponentId);

    return newComponentId;
  }

  // 실행 취소
  public undo(): void {
    this.commandInvoker.undo();
    this.updateSelectedComponents();
  }

  // 다시 실행
  public redo(): void {
    this.commandInvoker.redo();
    this.updateSelectedComponents();
  }

  // 임시 시각적 변경을 위한 메서드
  public applyTemporaryChange(action: () => void): void {
    action();
    this.updateSelectedComponents();
    this.notify();
  }

  // 선택된 컴포넌트 데코레이터 업데이트
  private updateSelectedComponents(): void {
    this.selectedComponents.clear();

    // 존재하는 선택 ID만 유지
    this._selectedIds = this._selectedIds.filter((id) => this.componentManager.findComponentById(id) !== undefined);

    // 선택된 각 컴포넌트에 데코레이터 적용
    for (const id of this._selectedIds) {
      const component = this.componentManager.findComponentById(id);
      if (component) {
        this.selectedComponents.set(id, new SelectedComponentDecorator(component));
      }
    }
  }

  // 옵저버 패턴 구현
  public subscribe(observer: Subscriber<null>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public unsubscribe(observer: Subscriber<null>): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private notify(): void {
    for (const observer of this.observers) {
      observer.update(null);
    }
  }

  public update(): void {
    this.updateSelectedComponents();
    this.notify();
  }
}
