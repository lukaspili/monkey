import { TaskCallback } from "@poppinss/cliui/types";

// Type of `task` from TaskCallback
type Task = {
  /**
   * Update task progress with a log message
   */
  update(logMessage: string): void;
  /**
   * Build error to mark the task as failed
   */
  error<T extends string | Error>(
    error: T
  ): T extends string
    ? {
        message: T;
        isError: true;
      }
    : T;
};

export abstract class SeedProcess {
  protected task!: Task;

  //@ts-ignore: Somehow not happy with the return type?
  process: TaskCallback = async (task) => {
    this.task = task;

    try {
      await this.run();
    } catch (e) {
      console.error(e);
      const error = {
        message: `${e.constructor.name}: ${JSON.stringify(e.errors)}`,
        isError: true,
      };
      return error;
    }

    return "Completed";
  };

  abstract run: () => Promise<void>;
}
