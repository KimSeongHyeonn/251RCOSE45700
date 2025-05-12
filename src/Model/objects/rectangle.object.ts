import { DrawableRectangle } from "~/Model/interfaces/drawable-shape.interface";
import { Component } from "~/Model/objects/component.object";

export class Rectangle extends Component {
  constructor({ posX, posY, width, height }: { posX?: number; posY?: number; width?: number; height?: number }) {
    super({ posX, posY, width, height });
  }

  public toDrawable(): DrawableRectangle[] {
    return [
      {
        type: "rectangle",
        x: this.posX,
        y: this.posY,
        width: this.width,
        height: this.height,
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
      },
    ];
  }
}
