import { ICommand } from "~/Commands/interfaces/command.interface";

export class CommandInvoker {
  private static instance: CommandInvoker;

  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private maxStackSize: number = 100; // 스택 크기 제한

  private constructor() {}

  public static getInstance(): CommandInvoker {
    if (!CommandInvoker.instance) {
      CommandInvoker.instance = new CommandInvoker();
    }
    return CommandInvoker.instance;
  }

  public executeCommand(command: ICommand): void {
    command.execute();

    this.undoStack.push(command);

    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }

    this.redoStack = [];
  }

  public undo(): void {
    if (this.undoStack.length === 0) {
      console.info("Nothing to undo");
      return;
    }

    const command = this.undoStack.pop()!;
    command.undo();

    this.redoStack.push(command);

    if (this.redoStack.length > this.maxStackSize) {
      this.redoStack.shift();
    }
  }

  public redo(): void {
    if (this.redoStack.length === 0) {
      console.info("Nothing to redo");
      return;
    }

    const command = this.redoStack.pop()!;
    command.redo();

    this.undoStack.push(command);
  }

  public clearStack(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
