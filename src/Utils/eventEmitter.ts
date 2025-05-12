type EventCallback<T> = (data: T) => void;

export class EventEmitter<T> {
  private listeners: Map<string, EventCallback<T>[]> = new Map();

  public on(event: string, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event)!;
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  public emit(event: string, data: T): void {
    if (!this.listeners.has(event)) return;

    for (const callback of this.listeners.get(event)!) {
      callback(data);
    }
  }
}
