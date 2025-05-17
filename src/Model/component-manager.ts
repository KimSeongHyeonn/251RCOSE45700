import { HandlePosition, SelectedComponentDecorator } from "~/Model/decorators/selected-component.decorator";
import { IComponent } from "~/Model/interfaces/component.interface";
import { DrawableShape } from "~/Model/interfaces/drawable-shape.interface";
import { Group } from "~/Model/objects/group.object";
import { Observable } from "~/Utils/observable.interface";
import { Subscriber } from "~/Utils/subscriber.interface";

export class ComponentManagerModel implements Observable<null> {
  private static instance: ComponentManagerModel;

  private _components: IComponent[] = [];
  private _selectedIds: Set<number> = new Set();

  private _observers: Subscriber<null>[] = [];

  private constructor() {}

  public static getInstance(): ComponentManagerModel {
    if (!ComponentManagerModel.instance) {
      ComponentManagerModel.instance = new ComponentManagerModel();
    }
    return ComponentManagerModel.instance;
  }

  // 특정 도형 선택
  public selectComponent(component: IComponent): void;
  public selectComponent(components: IComponent[]): void;
  public selectComponent(component: IComponent | IComponent[]): void {
    if (Array.isArray(component)) {
      component.forEach((comp) => {
        const foundComponent = this._components.find((c) => c.id === comp.id);
        if (foundComponent && !this._selectedIds.has(foundComponent.id)) {
          this._selectedIds.add(foundComponent.id);
        }
      });

      this.notify();
    } else {
      const foundComponent = this._components.find((c) => c.id === component.id);
      if (foundComponent && !this._selectedIds.has(foundComponent.id)) {
        this._selectedIds.add(foundComponent.id);
      }

      this.notify();
    }
  }

  // 특정 도형 선택 해제
  public deselectComponent(component: IComponent): void {
    if (this._selectedIds.has(component.id)) {
      this._selectedIds.delete(component.id);
    }

    this.notify();
  }

  // 모든 도형 선택 해제
  public clearSelection(): void {
    this._selectedIds.clear();

    this.notify();
  }

  // 도형 추가
  public addComponent(component: IComponent): void {
    this._components.push(component);

    this.notify();
  }

  // 선택된 도형 삭제
  public removeSelectedComponents(): void {
    this._components = this._components.filter((component) => !this._selectedIds.has(component.id));
    this._selectedIds.clear();

    this.notify();
  }

  // 선택된 도형 이동
  public moveSelectedComponents({ dx, dy }: { dx: number; dy: number }): void {
    const selectedComponents = this.getSelectedComponents();
    selectedComponents.forEach((component) => {
      component.move({ dx, dy });
    });

    this.notify();
  }

  // 선택된 도형 크기 조정
  public scaleSelectedComponents({ handlePosition, dx, dy }: { handlePosition: HandlePosition; dx: number; dy: number }): void {
    const selectedComponents = this.getSelectedComponents();
    selectedComponents.forEach((component) => {
      component.scaleByHandle(handlePosition, dx, dy);
    });

    this.notify();
  }

  // 선택된 도형 속성 변경
  public setSelectedComponentsProperty({ posX, posY, width, height }: { posX?: number; posY?: number; width?: number; height?: number }): void {
    const selectedComponents = this.getRawSelectedComponents();
    selectedComponents.forEach((component) => {
      component.move({
        dx: posX ? posX - component.posX : 0,
        dy: posY ? posY - component.posY : 0,
      });
      component.scale({
        width: width ? width - component.width : component.width,
        height: height ? height - component.height : component.height,
      });
    });

    this.notify();
  }

  // 선택된 도형 그룹화
  // 선택된 도형이 1개 이하일 경우 null 반환
  public groupSelectedComponents(): Group | null {
    const selectedComponents = this.getRawSelectedComponents();

    if (selectedComponents.length <= 1) {
      return null;
    }

    const newGroup = new Group({ components: selectedComponents });
    this._components = this._components.filter((c) => !this._selectedIds.has(c.id));
    this._components.push(newGroup);

    this._selectedIds.clear();
    this._selectedIds.add(newGroup.id);

    this.notify();
    return newGroup;
  }

  // 선택된 도형 그룹 해제
  // 선택된 도형이 1개가 아니거나 그룹이 아닐 경우 false 반환
  public ungroupSelectedComponents(): boolean {
    if (this._selectedIds.size !== 1) {
      return false;
    }

    const selectedId = Array.from(this._selectedIds)[0];
    const selectedComponent = this._components.find((c) => c.id === selectedId);

    if (!selectedComponent || selectedComponent.type !== "Group") {
      return false;
    }

    const group = selectedComponent as Group;
    const childComponents = group.getChildren();

    if (childComponents.length === 0) {
      return false;
    }

    this._components = this._components.filter((c) => c.id !== selectedId);
    this._components.push(...childComponents);

    this._selectedIds.clear();
    childComponents.forEach((child) => {
      this._selectedIds.add(child.id);
    });

    this.notify();
    return true;
  }

  // 선택된 도형을 맨 앞으로 가져오기
  public bringSelectedToFront(): void {
    if (this._selectedIds.size === 0) return;

    const selectedComponents: IComponent[] = [];
    const nonSelectedComponents: IComponent[] = [];

    for (const comp of this._components) {
      if (this._selectedIds.has(comp.id)) {
        selectedComponents.push(comp);
      } else {
        nonSelectedComponents.push(comp);
      }
    }

    this._components = [...nonSelectedComponents, ...selectedComponents];

    this.notify();
  }

  // 선택된 도형을 맨 뒤로 보내기
  public sendSelectedToBack(): void {
    if (this._selectedIds.size === 0) return;

    const selectedComponents: IComponent[] = [];
    const nonSelectedComponents: IComponent[] = [];

    for (const comp of this._components) {
      if (this._selectedIds.has(comp.id)) {
        selectedComponents.push(comp);
      } else {
        nonSelectedComponents.push(comp);
      }
    }

    this._components = [...selectedComponents, ...nonSelectedComponents];

    this.notify();
  }

  // 선택된 도형 가져오기
  public getSelectedComponents(): SelectedComponentDecorator[] {
    const selectedComponents = this._components.filter((c) => this._selectedIds.has(c.id));
    return selectedComponents.map((component) => new SelectedComponentDecorator(component));
  }

  private getRawSelectedComponents(): IComponent[] {
    return this._components.filter((c) => this._selectedIds.has(c.id));
  }

  // 선택된 도형 그리기 위한 DrawableShape 배열 반환
  public getSelectedDrawables(): DrawableShape[] {
    const selectedComponents = this.getSelectedComponents();
    return selectedComponents.flatMap((component) => component.toDrawable());
  }

  // 선택되지 않은 도형 그리기 위한 DrawableShape 배열 반환
  public getNonSelectedDrawables(): DrawableShape[] {
    const nonSelectedComponents = this._components.filter((c) => !this._selectedIds.has(c.id));
    return nonSelectedComponents.flatMap((component) => component.toDrawable());
  }

  // 모든 도형 그리기 위한 DrawableShape 배열 반환
  public getAllDrawables(): DrawableShape[] {
    const selectedDrawables = this.getSelectedDrawables();
    const nonSelectedDrawables = this.getNonSelectedDrawables();
    return [...selectedDrawables, ...nonSelectedDrawables];
  }

  // 해당 좌표에 있는 도형 반환
  // 좌표에 도형이 없을 경우 null 반환
  public getComponentAtPoint(x: number, y: number): IComponent | null {
    for (let i = this._components.length - 1; i >= 0; i--) {
      const component = this._components[i];
      if (component.isContainPoint({ x, y })) {
        return component;
      }
    }
    return null;
  }

  /**
   * 모든 컴포넌트를 배열로 반환합니다.
   * @returns 모든 컴포넌트 배열
   */
  public getAllComponents(): IComponent[] {
    return [...this._components];
  }

  // 옵저버 등록
  public subscribe(observer: Subscriber<null>): void {
    if (!this._observers.includes(observer)) {
      this._observers.push(observer);
    }
  }

  // 옵저버 해제
  public unsubscribe(observer: Subscriber<null>): void {
    this._observers = this._observers.filter((obs) => obs !== observer);
  }

  // 옵저버에게 알림
  private notify(): void {
    this._observers.forEach((observer) => observer.update(null));
  }
}
