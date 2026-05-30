#!/usr/bin/env bash
# Bring up infra and wait until every datastore is healthy.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ Starting infrastructure..."
docker compose -f docker-compose.infra.yml up -d

echo "▶ Waiting for databases to become healthy..."
for c in dd-mysql-user dd-mysql-task dd-mysql-goal dd-rabbitmq; do
  printf "  %s " "$c"
  until [ "$(docker inspect -f '{{.State.Health.Status}}' "$c" 2>/dev/null)" = "healthy" ]; do
    printf "."; sleep 2
  done
  echo " ✓"
done

echo "✔ Infra ready."
echo "  RabbitMQ UI : http://localhost:15672  (guest/guest)"
echo "  Mailhog UI  : http://localhost:8025"
echo "  Adminer     : http://localhost:8888"
