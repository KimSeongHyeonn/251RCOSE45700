import { Bound, ComponentType, Position, Style } from "~/Model/types/component.type";

export interface IComponent {
  get id(): number;
  get type(): ComponentType;

  get bound(): Bound;
  get style(): Style;

  move({ dx, dy }: { dx: number; dy: number }): void;
  scale({ sx, sy }: { sx: number; sy: number }): void;
  setProperties(properties: Partial<Bound>): void;

  isContainPoint(point: Position): boolean;
}
