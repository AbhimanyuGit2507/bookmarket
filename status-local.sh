#!/usr/bin/env bash

# ==============================================================================
# The BookMarket - Platform Local Status Script
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "\n${BOLD}${CYAN}======================================================${NC}"
echo -e "${BOLD}${CYAN}   The BookMarket - Local Service Status Check        ${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}\n"

# 1. MongoDB Status
echo -n "• MongoDB (Port 27017): "
if nc -z 127.0.0.1 27017 2>/dev/null || (exec 3<>/dev/tcp/127.0.0.1/27017) 2>/dev/null; then
  echo -e "${GREEN}ONLINE${NC}"
else
  echo -e "${RED}OFFLINE${NC}"
fi

# 2. Backend Status
echo -n "• Backend API (Port 5000): "
HEALTH=$(curl -s http://localhost:5000/health 2>/dev/null || true)
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  UPTIME=$(echo "$HEALTH" | grep -o '"uptime":[0-9.]*' | cut -d: -f2)
  echo -e "${GREEN}ONLINE${NC} (Uptime: ${UPTIME}s)"
else
  echo -e "${RED}OFFLINE${NC}"
fi

# 3. Frontend Status
echo -n "• Frontend App (Port 5173): "
if curl -s -I http://localhost:5173/ 2>&1 | grep -q "200 OK"; then
  echo -e "${GREEN}ONLINE${NC} (Accessible at http://localhost:5173)"
else
  echo -e "${RED}OFFLINE${NC}"
fi

echo -e "\n======================================================\n"
