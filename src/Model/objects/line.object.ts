import { Component } from "./component.object";

export class Line extends Component {
  constructor() {
    super({});
  }

  public draw(): void {
    console.log("Line");
  }
}
