"use client";

interface Array<T> {
  isNotEmpty(): boolean;
  isEmpty(): boolean;
  none(predicate: (item: T) => boolean): boolean;
}

interface ReadonlyArray<T> {
  isNotEmpty(): boolean;
  isEmpty(): boolean;
  none(predicate: (item: T) => boolean): boolean;
}

if (!Array.prototype.isNotEmpty) {
  Object.defineProperty(Array.prototype, "isNotEmpty", {
    value: function () {
      return this.length > 0;
    },
  });
}

if (!Array.prototype.isEmpty) {
  Object.defineProperty(Array.prototype, "isEmpty", {
    value: function () {
      return this.length === 0;
    },
  });
}

if (!Array.prototype.none) {
  Object.defineProperty(Array.prototype, "none", {
    value: function <T>(this: T[], predicate: (item: T) => boolean): boolean {
      return this.every((item) => !predicate(item));
    },
  });
}
