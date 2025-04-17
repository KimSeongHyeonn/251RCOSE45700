// 그리기 위한 데이터 제공을 위한 인터페이스
// 도형 Type에 따라 적절한 데이터 제공

export type ShapeType = "rectangle" | "ellipse" | "line";
export type DrawableShape = DrawableRectangle | DrawableEllipse | DrawableLine;

export interface DrawableShapeBase {
  type: ShapeType;
  strokeStyle?: string;
  fillStyle?: string;
  lineWidth?: number;
}

export interface DrawableRectangle extends DrawableShapeBase {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawableEllipse extends DrawableShapeBase {
  type: "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation?: number;
}

export interface DrawableLine extends DrawableShapeBase {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
