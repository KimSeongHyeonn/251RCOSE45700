export interface IComponent {
  draw(): void;

  move({ x, y }: { x: number; y: number }): void;

  scale({ x, y }: { x: number; y: number }): void;
}
