import { MoveCommand } from "~/Commands/move.command";
import { ITool } from "./ITool";
import { ToolType } from "./ToolType";
import { ICommand } from "~/Commands/interfaces/command.interface";
import { SelectCommand } from "~/Commands/select.command";
import { ComponentManagerModel } from "~/Model/component-manager";
import { CreateLineCommand } from "~/Commands/create-line.command";
import { CreateRectangleCommand } from "~/Commands/create-rectangle.command";
import { CreateEllipseCommand } from "~/Commands/create-ellipse.command";
import { ClearSelectCoomand } from "~/Commands/clear-select.command";
import { ScaleCommand } from "~/Commands/scale.command";
export class SelectTool implements ITool {
  readonly type = ToolType.SELECT;
  readonly label = "선택";

  getCommandOnClick({
    componentManager,
    x,
    y,
  }: {
    componentManager: ComponentManagerModel;
    x: number;
    y: number;
  }): ICommand {
    const component = componentManager.getComponentAtPoint(x, y);
    if (component) {
      return new SelectCommand(componentManager, component);
    } else {
      return new ClearSelectCoomand(componentManager);
    }
  }

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
  }): ICommand {
    const dx = endX - startX;
    const dy = endY - startY;
    const selectedComponents = componentManager.getSelectedComponents();

    for (const component of selectedComponents) {
      const handle = component.getHandleAtPosition(startX, startY);
      if (handle) {
        return new ScaleCommand(componentManager, handle, dx, dy);
      }
    }

    return new MoveCommand(componentManager, dx, dy);
  }
}
export class LineTool implements ITool {
  readonly type = ToolType.LINE;
  readonly label = "선";

  getCommandOnClick({
    componentManager,
    x,
    y,
  }: {
    componentManager: ComponentManagerModel;
    x: number;
    y: number;
  }): ICommand {
    return new CreateLineCommand(componentManager, {
      x,
      y,
      width: 100,
      height: 100,
    });
  }

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
  }): ICommand {
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    return new CreateLineCommand(componentManager, {
      x: startX,
      y: startY,
      width,
      height,
    });
  }
}
export class RectangleTool implements ITool {
  readonly type = ToolType.RECTANGLE;
  readonly label = "사각형";

  getCommandOnClick({
    componentManager,
    x,
    y,
  }: {
    componentManager: ComponentManagerModel;
    x: number;
    y: number;
  }): ICommand {
    return new CreateRectangleCommand(componentManager, {
      x,
      y,
      width: 100,
      height: 100,
    });
  }

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
  }): ICommand {
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    return new CreateRectangleCommand(componentManager, {
      x: startX,
      y: startY,
      width,
      height,
    });
  }
}

export class EllipseTool implements ITool {
  readonly type = ToolType.ELLIPSE;
  readonly label = "타원";

  getCommandOnClick({
    componentManager,
    x,
    y,
  }: {
    componentManager: ComponentManagerModel;
    x: number;
    y: number;
  }): ICommand {
    return new CreateEllipseCommand(componentManager, {
      x,
      y,
      width: 100,
      height: 100,
    });
  }

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
  }): ICommand {
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    return new CreateEllipseCommand(componentManager, {
      x: startX,
      y: startY,
      width,
      height,
    });
  }
}
// export class TextTool implements ITool {
//   readonly type = ToolType.TEXT;
//   readonly label = "텍스트";

//   getCommandOnClick({
//     componentManager,
//     x,
//     y,
//   }: {
//     componentManager: ComponentManagerModel;
//     x: number;
//     y: number;
//   }): ICommand {
//     return new CreateTextCommand(componentManager, { x, y, width: 100, height: 100 });
//   }

//   getCommandOnDrag({
//     componentManager,
//     startX,
//     startY,
//     endX,
//     endY,
//   }: {
//     componentManager: ComponentManagerModel;
//     startX: number;
//     startY: number;
//     endX: number;
//     endY: number;
//   }): ICommand {
//     return new MoveCommand(componentManager, endX - startX, endY - startY);
//   }
// }
