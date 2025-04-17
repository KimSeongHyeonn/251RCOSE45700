import { DrawableLine } from "../interfaces/drawable-shape.interface";
import { Component } from "./component.object";

export class Line extends Component {
  constructor({ posX, posY, width, height }: { posX?: number; posY?: number; width?: number; height?: number }) {
    super({ posX, posY, width, height });
  }

  toDrawable(): DrawableLine[] {
    return [
      {
        type: "line",
        x1: this.posX,
        y1: this.posY,
        x2: this.posX + this.width,
        y2: this.posY + this.height,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
      },
    ];
  }
}
