import { RoutineException } from "#exceptions/routine_exception";

export class ForbiddenException extends RoutineException {
  static status = 403;
  static code = "E_FORBIDDEN";
}
