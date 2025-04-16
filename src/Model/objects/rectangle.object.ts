import { Component } from "./component.object";

export class Rectangle extends Component {
  constructor() {
    super({ posX: 0, posY: 0, width: 10, height: 10 });
  }

  draw(): void {
    console.log("Rectangle");
  }
}
