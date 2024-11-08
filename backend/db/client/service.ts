import Database from "#db/database";
import app from "@adonisjs/core/services/app";

let db: Database;

/**
 * Returns a singleton instance of the Database class from the
 * container
 */
await app.booted(async () => {
  db = await app.container.make("edge.db");
});

export { db as default };
