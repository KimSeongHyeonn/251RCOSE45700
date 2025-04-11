import { Component } from "./component.object";

class Line extends Component {
  constructor() {
    super({ posX: 0, posY: 0, width: 10, height: 10 });
  }

  draw(): void {
    console.log("Line");
  }

  move({ x, y }: { x: number; y: number }): void {
    console.log("Line move");
  }

  scale({ x, y }: { x: number; y: number }): void {
    console.log("Line scale");
  }
}

export default Line;
