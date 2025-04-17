import { IComponent } from "../interfaces/component.interface";
import { DrawableShape } from "../interfaces/drawable-shape.interface";
import { ComponentDecorator } from "./component.decorator";

export class SelectedComponentDecorator extends ComponentDecorator {
  private readonly HANDLE_SIZE: number = 6;
  private handles: Handle[] = [];

  constructor(component: IComponent) {
    super(component);
    this.updateHandlePositions();
  }

  public toDrawable(): DrawableShape[] {
    this.updateHandlePositions();
    return [...this.component.toDrawable(), ...this.toDrawableResizeHandlers()];
  }

  private toDrawableResizeHandlers(): DrawableShape[] {
    return this.handles.map((handle) => handle.toDrawable()).flat();
  }

  private updateHandlePositions(): void {
    this.handles = [];

    const x = this.component.posX;
    const y = this.component.posY;
    const w = this.component.width;
    const h = this.component.height;

    const positions = [
      { pos: HandlePosition.TOP_LEFT, x: x, y: y },
      { pos: HandlePosition.TOP_MIDDLE, x: x + w / 2, y: y },
      { pos: HandlePosition.TOP_RIGHT, x: x + w, y: y },
      { pos: HandlePosition.MIDDLE_LEFT, x: x, y: y + h / 2 },
      { pos: HandlePosition.MIDDLE_RIGHT, x: x + w, y: y + h / 2 },
      { pos: HandlePosition.BOTTOM_LEFT, x: x, y: y + h },
      { pos: HandlePosition.BOTTOM_MIDDLE, x: x + w / 2, y: y + h },
      { pos: HandlePosition.BOTTOM_RIGHT, x: x + w, y: y + h },
    ];

    positions.forEach((p) => {
      this.handles.push(new Handle(p.pos, p.x, p.y, this.HANDLE_SIZE));
    });
  }

  public getHandleAtPosition(mouseX: number, mouseY: number): HandlePosition | null {
    for (const handle of this.handles) {
      if (handle.contains(mouseX, mouseY)) {
        return handle.position;
      }
    }
    return null;
  }

  public scaleByHandle(handlePos: HandlePosition, dx: number, dy: number): void {
    const w = this.component.width;
    const h = this.component.height;

    switch (handlePos) {
      case HandlePosition.TOP_LEFT:
        this.component.move({ dx, dy });
        this.component.scale({ width: w - dx, height: h - dy });
        break;
      case HandlePosition.TOP_MIDDLE:
        this.component.move({ dx: 0, dy });
        this.component.scale({ width: w, height: h - dy });
        break;
      case HandlePosition.TOP_RIGHT:
        this.component.move({ dx: 0, dy });
        this.component.scale({ width: w + dx, height: h - dy });
        break;
      case HandlePosition.MIDDLE_LEFT:
        this.component.move({ dx, dy: 0 });
        this.component.scale({ width: w - dx, height: h });
        break;
      case HandlePosition.MIDDLE_RIGHT:
        this.component.scale({ width: w + dx, height: h });
        break;
      case HandlePosition.BOTTOM_LEFT:
        this.component.move({ dx, dy: 0 });
        this.component.scale({ width: w - dx, height: h + dy });
        break;
      case HandlePosition.BOTTOM_MIDDLE:
        this.component.scale({ width: w, height: h + dy });
        break;
      case HandlePosition.BOTTOM_RIGHT:
        this.component.scale({ width: w + dx, height: h + dy });
        break;
    }

    this.updateHandlePositions();
  }
}

export class Handle {
  position: HandlePosition;
  x: number;
  y: number;
  size: number;

  constructor(position: HandlePosition, x: number, y: number, size: number = 6) {
    this.position = position;
    this.x = x;
    this.y = y;
    this.size = size;
  }

  public contains(mouseX: number, mouseY: number): boolean {
    const halfSize = this.size / 2;
    return mouseX >= this.x - halfSize && mouseX <= this.x + halfSize && mouseY >= this.y - halfSize && mouseY <= this.y + halfSize;
  }

  public toDrawable(): DrawableShape[] {
    return [
      {
        type: "rectangle",
        x: this.x - this.size / 2,
        y: this.y - this.size / 2,
        width: this.size,
        height: this.size,
      },
    ];
  }
}

export enum HandlePosition {
  TOP_LEFT,
  TOP_MIDDLE,
  TOP_RIGHT,
  MIDDLE_LEFT,
  MIDDLE_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_MIDDLE,
  BOTTOM_RIGHT,
}
