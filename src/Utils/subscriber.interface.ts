export interface Subscriber<T> {
  update(data: T): void;
}
