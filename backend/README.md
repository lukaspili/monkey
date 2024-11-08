# Monkey

### EdgeDB

Reset and migrate

```bash
edgedb database wipe --non-interactive
edgedb migration apply --dev-mode
```

Codegen

```bash
# Queries
bunx @edgedb/generate queries --target ts --file

# Interfaces
bunx @edgedb/generate interfaces --file dbschema/schema.ts

# JS
bunx @edgedb/generate edgeql-js --target ts
```
