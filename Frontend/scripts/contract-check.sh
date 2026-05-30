#!/usr/bin/env bash
# Cheap guard: greps the service sources for the agreed JWT claim + port.
# Fails loudly if a service drifts from docs/API_CONTRACTS.md.
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0

echo "▶ Checking JWT claim name consistency..."
if grep -rqs 'getClaimAsString("userId")' services/ ; then
  echo "  ✗ Found 'userId' claim reads. Contract claim is 'id'. See INTEGRATION_FIXES.md §1."
  fail=1
else
  echo "  ✓ No stale 'userId' claim reads."
fi

echo "▶ Checking server.port is set per service..."
for s in user task goal notification; do
  f="services/$s-service/src/main/resources/application.properties"
  if [ -f "$f" ] && grep -q '^server.port=' "$f"; then
    echo "  ✓ $s-service sets server.port"
  else
    echo "  ✗ $s-service has no server.port (defaults to 8080 → conflict). See INTEGRATION_FIXES.md §3."
    fail=1
  fi
done

[ "$fail" -eq 0 ] && echo "✔ Contract check passed." || echo "✘ Contract check found issues."
exit $fail
