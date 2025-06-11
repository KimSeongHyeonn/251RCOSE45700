import { EditorState } from "~/ViewModel/editor-state";

export interface ITool {
  activate(): void;
  deactivate(): void;

  handleMouseDown(editorState: EditorState, x: number, y: number, isCtrlPressed: boolean): void;
  handleMouseMove(editorState: EditorState, x: number, y: number): void;
  handleMouseUp(editorState: EditorState, x: number, y: number): void;
}
