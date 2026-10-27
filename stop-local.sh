#!/usr/bin/env bash

# ==============================================================================
# The BookMarket - Platform Local Shutdown Script
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "\n${BOLD}${YELLOW}======================================================${NC}"
echo -e "${BOLD}${YELLOW}   Stopping The BookMarket Platform Services          ${NC}"
echo -e "${BOLD}${YELLOW}======================================================${NC}\n"

# 1. Stop Backend
if [ -f ".server.pid" ]; then
  SERVER_PID=$(cat .server.pid 2>/dev/null || true)
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    echo -e "Stopping Backend API (PID: $SERVER_PID)..."
    kill "$SERVER_PID" 2>/dev/null || true
    sleep 1
    if kill -0 "$SERVER_PID" 2>/dev/null; then
      kill -9 "$SERVER_PID" 2>/dev/null || true
    fi
    echo -e "  ${GREEN}✓ Backend stopped.${NC}"
  fi
  rm -f .server.pid
fi

# Ensure port 5000 is freed
fuser -k 5000/tcp 2>/dev/null || true

# 2. Stop Frontend
if [ -f ".client.pid" ]; then
  CLIENT_PID=$(cat .client.pid 2>/dev/null || true)
  if [ -n "$CLIENT_PID" ] && kill -0 "$CLIENT_PID" 2>/dev/null; then
    echo -e "Stopping Frontend Web App (PID: $CLIENT_PID)..."
    kill "$CLIENT_PID" 2>/dev/null || true
    sleep 1
    if kill -0 "$CLIENT_PID" 2>/dev/null; then
      kill -9 "$CLIENT_PID" 2>/dev/null || true
    fi
    echo -e "  ${GREEN}✓ Frontend stopped.${NC}"
  fi
  rm -f .client.pid
fi

# Ensure port 5173 is freed
fuser -k 5173/tcp 2>/dev/null || true

echo -e "\n${BOLD}${GREEN}======================================================${NC}"
echo -e "${BOLD}${GREEN}   All Local Platform Services Have Been Stopped.     ${NC}"
echo -e "${BOLD}${GREEN}======================================================${NC}\n"
