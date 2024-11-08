import Database from "#db/database";

declare module "@adonisjs/core/types" {
  interface ContainerBindings {
    "edge.db": Database;
  }
}
