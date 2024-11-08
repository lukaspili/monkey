import AssertException from "#exceptions/assert_exception";

export class Data<T> {
  readonly isDataResponse = true;

  constructor(
    readonly value: T | null,
    readonly hasValue: boolean
  ) {}

  // List always has a value, it's at least an empty list.
  static list<T>(value: Array<T>): Data<Array<T>> {
    return new Data(value, true);
  }

  static single<T>(value: T): Data<T> {
    if (value == null || Array.isArray(value)) {
      throw new AssertException();
    }

    return new Data(value, true);
  }

  static orEmpty<T>(value: T | null): Data<T> {
    return new Data(value, true);
  }

  static orNotFound<T>(value: T | null): Data<T> {
    return new Data(value, value != null);
  }

  static empty(): Data<void> {
    return new Data(null, true);
  }

  static isInstance(obj: any): obj is Data<any> {
    if (!obj) {
      return false;
    }

    const shapeMatches = "isDataResponse" in obj && "value" in obj && "hasValue" in obj;
    if (!shapeMatches) {
      return false;
    }

    return obj.isDataResponse === true;
  }
}
