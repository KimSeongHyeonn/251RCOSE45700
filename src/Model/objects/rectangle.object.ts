import { Component } from "./component.object";

export class Rectangle extends Component {
  constructor() {
    super({});
  }

  public draw(): void {
    console.log("Rectangle");
  }
}
