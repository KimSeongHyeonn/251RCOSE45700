import { Component } from "./component.object";

export class Line extends Component {
  constructor() {
    super({ posX: 0, posY: 0, width: 10, height: 10 });
  }

  public draw(): void {
    console.log("Line");
  }
}
