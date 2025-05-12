import {
  IPropertyEditor,
  TextPropertyEditor,
  NumberPropertyEditor,
  ColorPropertyEditor,
} from "./IPropertyEditor";

export class PropertyEditorFactory {
  private static editors: Map<string, IPropertyEditor> = new Map<
    string,
    IPropertyEditor
  >([
    ["string", new TextPropertyEditor()],
    ["number", new NumberPropertyEditor()],
    ["color", new ColorPropertyEditor()],
  ]);

  public static registerEditor(editor: IPropertyEditor): void {
    PropertyEditorFactory.editors.set(editor.propertyType, editor);
  }

  public static getEditor(type: string): IPropertyEditor {
    const editor = PropertyEditorFactory.editors.get(type);
    if (!editor) {
      return PropertyEditorFactory.editors.get("string")!; // 기본 에디터
    }
    return editor;
  }
}
