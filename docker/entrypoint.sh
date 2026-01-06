#!/bin/sh
set -e

echo "Starting application initialization..."

# Check if database exists
DB_PATH="/app/data/baby.db"
DB_TEMPLATE="/app/data/baby.db.template"

# Initialize database from template if needed
if [ ! -f "$DB_PATH" ] || [ ! -s "$DB_PATH" ]; then
    echo "Database not found or empty, copying from template..."
    if [ -f "$DB_TEMPLATE" ]; then
        cp "$DB_TEMPLATE" "$DB_PATH"
        echo "Database initialized from template successfully!"
    else
        echo "Error: Template database not found at $DB_TEMPLATE"
        exit 1
    fi
else
    echo "Database file exists, using existing database."
fi

echo "Starting Next.js server..."
exec node server.js

