import { DrawableEllipse } from "~/Model/interfaces/drawable-shape.interface";
import { Component } from "~/Model/objects/component.object";

export class Ellipse extends Component {
  constructor({ posX, posY, width, height }: { posX?: number; posY?: number; width?: number; height?: number }) {
    super({ posX, posY, width, height });
  }

  public toDrawable(): DrawableEllipse[] {
    return [
      {
        type: "ellipse",
        x: this.posX + this.width / 2, // 중심 x
        y: this.posY + this.height / 2, // 중심 y
        radiusX: this.width / 2,
        radiusY: this.height / 2,
        fillStyle: this.fillStyle,
        strokeStyle: this.strokeStyle,
        lineWidth: this.lineWidth,
      },
    ];
  }
}
