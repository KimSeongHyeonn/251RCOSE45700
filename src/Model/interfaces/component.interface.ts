export interface IComponent {
  draw(): void;

  move({ dx, dy }: { dx: number; dy: number }): void;

  scale({ width, height }: { width: number; height: number }): void;

  get id(): number;
  get posX(): number;
  get posY(): number;
  get width(): number;
  get height(): number;
}
