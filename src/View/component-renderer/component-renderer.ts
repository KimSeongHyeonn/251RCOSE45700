import { Group } from "~/Model/objects/group.object";
import { IComponent } from "~/Model/interfaces/component.interface";
import { ComponentType } from "~/Model/types/component.type";
import { ComponentTypeRenderer } from "~/View/component-renderer/interfaces/component-type-renderer.interface";
import { RectangleRenderer } from "~/View/component-renderer/type-renderer/rectangle-renderer";
import { LineRenderer } from "~/View/component-renderer/type-renderer/line-renderer";
import { GroupRenderer } from "~/View/component-renderer/type-renderer/group-renderer";
import { EllipseRenderer } from "~/View/component-renderer/type-renderer/ellipse-renderer";

export class ComponentRenderer {
  private rendererMap: Record<ComponentType, ComponentTypeRenderer> = {} as Record<ComponentType, ComponentTypeRenderer>;

  constructor(private ctx: CanvasRenderingContext2D) {
    // 기본 렌더러들 등록
    this.registerRenderer("rectangle", new RectangleRenderer());
    this.registerRenderer("ellipse", new EllipseRenderer());
    this.registerRenderer("line", new LineRenderer());
    this.registerRenderer("group", new GroupRenderer(this)); // 그룹 렌더러에는 자기 자신 전달
  }

  public registerRenderer(type: ComponentType, renderer: ComponentTypeRenderer): void {
    this.rendererMap[type] = renderer;
  }

  public render(component: IComponent): void {
    // 단일 컴포넌트만 렌더링, 그룹의 자식은 처리하지 않음
    const renderer = this.rendererMap[component.type];
    if (renderer) {
      renderer.render(this.ctx, component);
    } else {
      console.warn(`No renderer found for component type: ${component.type}`);
    }
  }

  public renderComponent(component: IComponent): void {
    // 컴포넌트와 필요한 경우 자식을 렌더링
    this.render(component);

    // 그룹일 경우에만 자식 요소 렌더링
    if (component.type === "group") {
      this.renderGroupChildren(component as unknown as Group);
    }
  }

  public renderGroupChildren(group: Group): void {
    const children = group.getChildren();

    // Z-Order 순서대로 렌더링
    for (const child of children) {
      // 여기서는 renderComponent가 아닌 render를 호출해 무한 중첩을 방지
      this.renderComponent(child); // 각 자식에 대해 컴포넌트 렌더링 (자식이 또 그룹일 수 있음)
    }
  }

  public renderComponents(components: IComponent[]): void {
    // 여러 컴포넌트 렌더링
    for (const component of components) {
      this.renderComponent(component);
    }
  }

  public clear(width: number, height: number): void {
    this.ctx.clearRect(0, 0, width, height);
  }
}
