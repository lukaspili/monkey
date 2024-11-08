import { RoutineException } from "#exceptions/routine_exception";

export class NotFoundException extends RoutineException {
  static status = 404;
  static code = "E_RESOURCE_NOT_FOUND";

  constructor(message: string = "Not found.") {
    super(message);
  }

  static of(resource: string) {
    return new NotFoundException(`${resource} not found.`);
  }

  static custom(message: string) {
    return new NotFoundException(message);
  }
}
