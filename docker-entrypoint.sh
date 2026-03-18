#!/bin/sh
set -e

echo "Running better-auth migrations..."

for migration in /app/better-auth_migrations/*.sql; do
  if [ -f "$migration" ]; then
    name=$(basename "$migration")
    # Check if already applied
    applied=$(sqlite3 "$AUTH_DB_PATH" "SELECT COUNT(*) FROM _migrations WHERE name='$name';" 2>/dev/null || echo "0")
    if [ "$applied" = "0" ]; then
      echo "Applying migration: $name"
      sqlite3 "$AUTH_DB_PATH" < "$migration"
      sqlite3 "$AUTH_DB_PATH" "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT); INSERT INTO _migrations VALUES('$name', datetime('now'));"
    else
      echo "Skipping already applied: $name"
    fi
  fi
done

echo "Migrations complete."
exec node server.js
