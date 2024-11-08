import { configApp } from "@adonisjs/eslint-config";
export default configApp({
  ignores: ["build", "bin", "node_modules", "db/gen"],
  rules: {
    eqeqeq: ["error", "smart"],
  },
});
