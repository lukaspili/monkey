import Database from "#db/database";
import { ApplicationService } from "@adonisjs/core/types";

export default class DatabaseProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Invoked by AdonisJS to register container bindings
   */
  register() {
    this.app.container.singleton(Database, async (_) => {
      return new Database();
    });

    this.app.container.alias("edge.db", Database);
  }

  /**
   * Invoked by AdonisJS to extend the framework or pre-configure
   * objects
   */
  async boot() {
    const db = await this.app.container.make("edge.db");
    await db.ensureConnected();
  }

  /**
   * Gracefully close connections during shutdown
   */
  async shutdown() {
    const db = await this.app.container.make("edge.db");
    await db.client.close();
  }
}
