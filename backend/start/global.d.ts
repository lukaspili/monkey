interface String {
  isEmpty(): boolean;
  isNotEmpty(): boolean;
  isBlank(): boolean;
  isNotBlank(): boolean;
}

interface Array<T> {
  isEmpty(): boolean;
  isNotEmpty(): boolean;
  none(predicate: (item: T) => boolean): boolean;
}
