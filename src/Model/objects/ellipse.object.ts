import { Component } from "./component.object";

export class Ellipse extends Component {
  constructor() {
    super({});
  }

  public draw(): void {
    console.log("Ellipse");
  }
}
