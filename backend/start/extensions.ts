String.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

String.prototype.isNotEmpty = function (): boolean {
  return this.length > 0;
};

String.prototype.isBlank = function (): boolean {
  return this.trim().length === 0;
};

String.prototype.isNotBlank = function (): boolean {
  return this.trim().length > 0;
};

Array.prototype.isEmpty = function (): boolean {
  return this.length === 0;
};

Array.prototype.isNotEmpty = function (): boolean {
  return this.length > 0;
};

Array.prototype.none = function <T>(predicate: (item: T) => boolean): boolean {
  return !this.some(predicate);
};
