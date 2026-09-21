#!/bin/bash
# Backup completo de la base de datos securedesk (contenedor Docker securedesk_db)
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$(dirname "$0")/../backups"
BACKUP_FILE="$BACKUP_DIR/securedesk_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "Generando backup de PostgreSQL (securedesk) -> $BACKUP_FILE"
docker exec securedesk_db pg_dump -U postgres -d securedesk > "$BACKUP_FILE"

echo "Backup generado: $BACKUP_FILE"
ls -lh "$BACKUP_FILE"
