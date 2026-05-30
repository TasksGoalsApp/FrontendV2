#!/usr/bin/env bash
# Register a demo user and print a usable JWT. Requires user-service running on :8081.
set -euo pipefail
BASE="${USER_SERVICE_URL:-http://localhost:8081/user}"

echo "▶ Registering demo user..."
curl -s -X POST "$BASE/register" -H 'Content-Type: application/json' -d '{
  "name": "Demo Dojo",
  "username": "demo",
  "email": "demo@dailydojo.test",
  "dateOfBirth": "1995-01-01",
  "password": "Password123!"
}' || true
echo

echo "▶ Logging in..."
curl -s -X POST "$BASE/login" -H 'Content-Type: application/json' -d '{
  "username": "demo",
  "password": "Password123!"
}'
echo
echo "Copy the accessToken above into the Authorization: Bearer <token> header."
