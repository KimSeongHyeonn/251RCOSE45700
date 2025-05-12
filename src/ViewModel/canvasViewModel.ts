import { IComponent } from "~/Model/interfaces/component.interface";
import { Ellipse } from "~/Model/objects/ellipse.object";
import { Group } from "~/Model/objects/group.object";
import { Line } from "~/Model/objects/line.object";
import { Rectangle } from "~/Model/objects/rectangle.object";
import { CanvasView } from "~/View/canvasView";

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
  private view: CanvasView | null = null;
  private rootGroup: Group;

  constructor() {
    this.rootGroup = new Group({});
  }

  // View 등록
  public registerView(view: CanvasView): void {
    this.view = view;
  }

  // 객체 생성
  public createComponent({
    type,
    x,
    y,
  }: {
    type: string;
    x: number;
    y: number;
  }): void {
    let component: IComponent;

    switch (type) {
      case "line":
        component = new Line({ posX: x, posY: y }); // Line 클래스 사용
        break;
      case "rectangle":
        component = new Rectangle({ posX: x, posY: y }); // Rectangle 클래스 사용
        break;
      case "ellipse":
        component = new Ellipse({ posX: x, posY: y }); // Ellipse 클래스 사용
        break;
      default:
        return;
    }

    this.rootGroup.add({ component });
    this.components.push(component);
    this.render();
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

    // 객체 히트 테스트 및 선택 로직 구현 필요
    // (지금은 간단히 첫 번째 컴포넌트 선택으로 대체)
    if (this.components.length > 0) {
      this.selectedComponents.push(this.components[0]);
    }

    this.render();
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
    if (this.view) {
      this.view.render(this.components, this.selectedComponents);
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
}
