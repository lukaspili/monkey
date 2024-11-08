import { RoutineException } from "#exceptions/routine_exception";

export class UnauthorizedException extends RoutineException {
  static status = 401;
  static code = "E_UNAUTHORIZED";
}
