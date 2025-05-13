import { ICommand } from "~/Commands/interfaces/command.interface";

export class CommandInvoker {
  public executeCommand(command: ICommand): void {
    command.execute();
  }
}
