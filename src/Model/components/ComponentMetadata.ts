export interface PropertyMetadata {
  name: string;
  type: string;
  displayName: string;
  defaultValue?: any;
}

export class ComponentMetadata {
  private static metadata: Map<string, PropertyMetadata[]> = new Map();

  public static registerProperty(
    componentType: string,
    metadata: PropertyMetadata
  ): void {
    if (!ComponentMetadata.metadata.has(componentType)) {
      ComponentMetadata.metadata.set(componentType, []);
    }
    ComponentMetadata.metadata.get(componentType)!.push(metadata);
  }

  public static getProperties(componentType: string): PropertyMetadata[] {
    return ComponentMetadata.metadata.get(componentType) || [];
  }
}

// 예시: 컴포넌트 메타데이터 등록
ComponentMetadata.registerProperty("rectangle", {
  name: "name",
  type: "string",
  displayName: "이름",
});

ComponentMetadata.registerProperty("rectangle", {
  name: "width",
  type: "number",
  displayName: "너비",
  defaultValue: 100,
});

ComponentMetadata.registerProperty("rectangle", {
  name: "height",
  type: "number",
  displayName: "높이",
  defaultValue: 100,
});

ComponentMetadata.registerProperty("rectangle", {
  name: "fillColor",
  type: "color",
  displayName: "채우기 색상",
  defaultValue: "#ffffff",
});
