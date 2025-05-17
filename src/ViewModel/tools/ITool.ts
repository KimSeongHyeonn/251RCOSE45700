import { ICommand } from "~/Commands/interfaces/command.interface";
import { ToolType } from "./ToolType";
import { ComponentManagerModel } from "~/Model/component-manager";

export interface ITool {
  readonly type: ToolType;
  readonly label: string;
  readonly icon?: string;
  getCommandOnClick({
    componentManager,
    x,
    y,
  }: {
    componentManager: ComponentManagerModel;
    x: number;
    y: number;
  }): ICommand;
  getCommandOnDrag({
    componentManager,
    startX,
    startY,
    endX,
    endY,
  }: {
    componentManager: ComponentManagerModel;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }): ICommand;
}
