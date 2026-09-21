#!/bin/bash
# Restaura un backup .sql sobre la base de datos securedesk (contenedor Docker securedesk_db)
set -e

if [ -z "$1" ]; then
  echo "Uso: ./restore.sh <ruta_al_backup.sql>"
  exit 1
fi

BACKUP_FILE="$1"

echo "Recreando base de datos securedesk antes de restaurar..."
docker exec securedesk_db psql -U postgres -c "DROP DATABASE IF EXISTS securedesk;"
docker exec securedesk_db psql -U postgres -c "CREATE DATABASE securedesk;"

echo "Restaurando $BACKUP_FILE en securedesk..."
cat "$BACKUP_FILE" | docker exec -i securedesk_db psql -U postgres -d securedesk

echo "Restauracion completada."
