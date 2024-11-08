import { RoutineException } from "#exceptions/routine_exception";

export class FlowException extends RoutineException {
  static status = 500;
  static code = "E_FLOW";
}
