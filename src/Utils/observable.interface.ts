import { Subscriber } from "~/Utils/subscriber.interface";

export interface Observable<T> {
  subscribe(subscriber: Subscriber<T>): void;
  unsubscribe(subscriber: Subscriber<T>): void;
}
