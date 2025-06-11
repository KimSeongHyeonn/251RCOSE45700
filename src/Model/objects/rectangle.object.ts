import { Component } from "~/Model/objects/component.object";
import { ComponentType } from "~/Model/types/component.type";

export class Rectangle extends Component {
  constructor({ posX, posY, width, height }: { posX?: number; posY?: number; width?: number; height?: number }) {
    super({ posX, posY, width, height });
  }

  public get type(): ComponentType {
    return "rectangle";
  }
}
