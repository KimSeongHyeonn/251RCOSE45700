import { IComponent } from "~/Model/interfaces/component.interface";
import { Group } from "~/Model/objects/group.object";
import { Bound } from "~/Model/types/component.type";
import { Observable } from "~/Utils/observable.interface";
import { Subscriber } from "~/Utils/subscriber.interface";

export class ComponentManager implements Observable<null> {
  private static instance: ComponentManager;

  private _components: IComponent[] = [];

  private _observers: Subscriber<null>[] = [];

  private constructor() {}

  public static getInstance(): ComponentManager {
    if (!ComponentManager.instance) {
      ComponentManager.instance = new ComponentManager();
    }
    return ComponentManager.instance;
  }

  // 도형 추가
  public addComponent(component: IComponent): void;
  public addComponent(components: IComponent[]): void;
  public addComponent(component: IComponent | IComponent[]): void {
    if (Array.isArray(component)) {
      this._components.push(...component);
    } else {
      this._components.push(component);
    }

    this.notify();
  }

  // 도형 삭제
  public removeComponent(componentId: number): void;
  public removeComponent(componentIds: number[]): void;
  public removeComponent(componentId: number | number[]): void {
    if (Array.isArray(componentId)) {
      const validComponents = this.getValidComponents(componentId);

      const idSet = new Set(validComponents.map((c) => c.id));
      this._components = this._components.filter((c) => !idSet.has(c.id));
    } else {
      const component = this.getValidComponent(componentId);

      this._components = this._components.filter((c) => c.id !== component.id);
    }

    this.notify();
  }

  // 도형 이동
  public moveComponent(componentId: number, dx: number, dy: number): void;
  public moveComponent(componentIds: number[], dx: number, dy: number): void;
  public moveComponent(componentId: number | number[], dx: number, dy: number): void {
    if (Array.isArray(componentId)) {
      const validComponents = this.getValidComponents(componentId);

      for (const component of validComponents) {
        component.move({ dx, dy });
      }
    } else {
      const component = this.getValidComponent(componentId);

      component.move({ dx, dy });
    }

    this.notify();
  }

  // 도형 크기 조정
  public scaleComponent(componentId: number, sx: number, sy: number): void;
  public scaleComponent(componentIds: number[], sx: number, sy: number): void;
  public scaleComponent(componentId: number | number[], sx: number, sy: number): void {
    if (Array.isArray(componentId)) {
      const validComponents = this.getValidComponents(componentId);

      for (const component of validComponents) {
        component.scale({ sx, sy });
      }
    } else {
      const component = this.getValidComponent(componentId);

      component.scale({ sx, sy });
    }

    this.notify();
  }

  // 도형 속성 설정
  public setProperties(componentId: number, properties: Partial<Bound>): void;
  public setProperties(componentIds: number[], properties: Partial<Bound>): void;
  public setProperties(componentId: number | number[], properties: Partial<Bound>): void {
    if (Array.isArray(componentId)) {
      const validComponents = this.getValidComponents(componentId);

      for (const component of validComponents) {
        component.setProperties(properties);
      }
    } else {
      const component = this.getValidComponent(componentId);

      component.setProperties(properties);
    }

    this.notify();
  }

  // ID로 도형 찾기
  public findComponentById(componentId: number): IComponent | undefined {
    return this._components.find((c) => c.id === componentId);
  }

  // 좌표로 도형 찾기
  public findComponentAtPoint(x: number, y: number): IComponent | undefined {
    // 배열의 뒤에서부터 검색 (z-order 상 위에 있는 컴포넌트)
    for (let i = this._components.length - 1; i >= 0; i--) {
      if (this._components[i].isContainPoint({ x, y })) {
        return this._components[i];
      }
    }
    return undefined;
  }

  // 모든 도형 가져오기
  public getAllComponents(): IComponent[] {
    return [...this._components];
  }

  // 도형 순서 변경(z-order)
  public changeComponentOrder(componentId: number, newIndex: number): void {
    const index = this._components.findIndex((c) => c.id === componentId);

    if (index === -1) {
      throw new Error(`Component with ID ${componentId} not found`);
    }
    if (newIndex < 0 || newIndex >= this._components.length) {
      throw new RangeError(`Index ${newIndex} is out of range (0-${this._components.length - 1})`);
    }

    if (index === newIndex) {
      return;
    }

    // 컴포넌트를 현재 위치에서 제거
    const [component] = this._components.splice(index, 1);

    // 새 위치에 삽입
    this._components.splice(newIndex, 0, component);

    this.notify();
  }

  // 도형 맨 앞으로 가져오기
  public bringToFront(componentId: number): void {
    const index = this._components.findIndex((c) => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component with ID ${componentId} not found`);
    }

    // 컴포넌트를 현재 위치에서 제거하고 배열 끝에 추가
    const [component] = this._components.splice(index, 1);
    this._components.push(component);

    this.notify();
  }

  // 도형 맨 뒤로 보내기
  public sendToBack(componentId: number): void {
    const index = this._components.findIndex((c) => c.id === componentId);
    if (index === -1) {
      throw new Error(`Component with ID ${componentId} not found`);
    }

    // 컴포넌트를 현재 위치에서 제거하고 배열 시작에 추가
    const [component] = this._components.splice(index, 1);
    this._components.unshift(component);

    this.notify();
  }

  // 그룹 생성
  public createGroup(componentIds: number[]): Group {
    // 그룹화할 컴포넌트들 찾기
    const componentsToGroup = this.getValidComponents(componentIds);

    if (componentsToGroup.length <= 1) {
      throw new Error(`At least two components are required to create a group. Provided: ${componentsToGroup.length}`);
    }

    // 그룹에 포함될 컴포넌트들 제거
    this._components = this._components.filter((c) => !componentIds.includes(c.id));

    // 새 그룹 생성
    const group = new Group({ components: componentsToGroup });

    // 그룹 추가
    this._components.push(group);

    this.notify();
    return group;
  }

  // 그룹 해제
  public ungroup(groupId: number): IComponent[] {
    const component = this.getValidComponent(groupId);
    if (component.type !== "group") {
      throw new Error(`Component with ID ${groupId} is not a group`);
    }

    // 그룹으로 캐스팅
    const group = component as unknown as Group;
    const children = group.getChildren();

    // 그룹 제거
    const index = this._components.findIndex((c) => c.id === groupId);
    this._components.splice(index, 1);

    // 자식 컴포넌트들 추가
    this._components.push(...children);

    this.notify();
    return children;
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

  private getValidComponents(componentIds: number[]): IComponent[] {
    if (componentIds.length === 0) {
      throw new Error(`No component IDs provided}`);
    }

    const uniqueIds = [...new Set(componentIds)];
    if (uniqueIds.length !== componentIds.length) {
      console.warn("Duplicate component IDs detected. Each component will be processed only once.");
    }

    const validComponents: IComponent[] = [];
    const invalidIds: number[] = [];

    for (const id of uniqueIds) {
      const component = this.findComponentById(id);
      if (component) {
        validComponents.push(component);
      } else {
        invalidIds.push(id);
      }
    }

    if (validComponents.length === 0 && invalidIds.length > 0) {
      throw new Error(`None of the provided component IDs exist: ${invalidIds.join(", ")}`);
    }

    if (invalidIds.length > 0) {
      console.warn(`Some component IDs were not found: ${invalidIds.join(", ")}`);
    }

    return validComponents;
  }

  private getValidComponent(componentId: number): IComponent {
    const component = this.findComponentById(componentId);
    if (!component) {
      throw new Error(`Component with ID ${componentId} not found`);
    }
    return component;
  }
}
