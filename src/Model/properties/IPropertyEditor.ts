export interface IPropertyEditor {
  readonly propertyType: string;
  createEditor(
    propertyKey: string,
    propertyValue: any,
    onChange: (newValue: any) => void
  ): HTMLElement;
  getValue(element: HTMLElement): any;
  setValue(element: HTMLElement, value: any): void;
}

export class TextPropertyEditor implements IPropertyEditor {
  readonly propertyType = "string";

  createEditor(
    propertyKey: string,
    propertyValue: any,
    onChange: (newValue: any) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.className = "property-editor";

    const input = document.createElement("input");
    input.type = "text";
    input.value = String(propertyValue || "");
    input.addEventListener("change", () => onChange(input.value));

    const label = document.createElement("label");
    label.textContent = propertyKey;

    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  getValue(element: HTMLElement): any {
    return (element.querySelector("input") as HTMLInputElement).value;
  }

  setValue(element: HTMLElement, value: any): void {
    (element.querySelector("input") as HTMLInputElement).value = String(value);
  }
}

export class NumberPropertyEditor implements IPropertyEditor {
  readonly propertyType = "number";

  createEditor(
    propertyKey: string,
    propertyValue: any,
    onChange: (newValue: any) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.className = "property-editor";

    const input = document.createElement("input");
    input.type = "number";
    input.value = String(propertyValue || 0);
    input.addEventListener("change", () => onChange(Number(input.value)));

    const label = document.createElement("label");
    label.textContent = propertyKey;

    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  getValue(element: HTMLElement): any {
    return Number((element.querySelector("input") as HTMLInputElement).value);
  }

  setValue(element: HTMLElement, value: any): void {
    (element.querySelector("input") as HTMLInputElement).value = String(value);
  }
}

export class ColorPropertyEditor implements IPropertyEditor {
  readonly propertyType = "color";

  createEditor(
    propertyKey: string,
    propertyValue: any,
    onChange: (newValue: any) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.className = "property-editor";

    const input = document.createElement("input");
    input.type = "color";
    input.value = propertyValue || "#000000";
    input.addEventListener("change", () => onChange(input.value));

    const label = document.createElement("label");
    label.textContent = propertyKey;

    container.appendChild(label);
    container.appendChild(input);
    return container;
  }

  getValue(element: HTMLElement): any {
    return (element.querySelector("input") as HTMLInputElement).value;
  }

  setValue(element: HTMLElement, value: any): void {
    (element.querySelector("input") as HTMLInputElement).value = value;
  }
}
