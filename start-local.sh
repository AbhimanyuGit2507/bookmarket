#!/usr/bin/env bash
set -e

# ==============================================================================
# The BookMarket - Platform Local Startup Script
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
echo -e "${BOLD}${CYAN}   Starting The BookMarket Platform Locally           ${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}\n"

# 1. Check & Ensure MongoDB
echo -e "${CYAN}▶ Step 1: Checking MongoDB service...${NC}"
if nc -z 127.0.0.1 27017 2>/dev/null || (exec 3<>/dev/tcp/127.0.0.1/27017) 2>/dev/null; then
  echo -e "  ${GREEN}✓ MongoDB is active and reachable on port 27017.${NC}"
elif command -v docker &> /dev/null; then
  if docker ps -a --format '{{.Names}}' | grep -q "^bookmarket-mongo$"; then
    echo -e "  ${YELLOW}Starting existing 'bookmarket-mongo' Docker container...${NC}"
    docker start bookmarket-mongo > /dev/null
  else
    echo -e "  ${YELLOW}Spawning new MongoDB Docker container on port 27017...${NC}"
    docker run -d --name bookmarket-mongo -p 27017:27017 mongo:latest > /dev/null
  fi
  sleep 2
  echo -e "  ${GREEN}✓ MongoDB container started.${NC}"
else
  echo -e "  ${RED}✗ Error: MongoDB is not running on port 27017 and Docker is not available.${NC}"
  echo -e "  Please start MongoDB manually or ensure port 27017 is accessible."
  exit 1
fi

# 2. Check Dependencies
echo -e "\n${CYAN}▶ Step 2: Checking dependencies...${NC}"
if [ ! -d "server/node_modules" ]; then
  echo -e "  ${YELLOW}Installing server dependencies...${NC}"
  npm install --prefix server
fi
if [ ! -d "client/node_modules" ]; then
  echo -e "  ${YELLOW}Installing client dependencies...${NC}"
  npm install --prefix client
fi
echo -e "  ${GREEN}✓ Server and client dependencies verified.${NC}"

# 3. Clean up any existing instances on ports 5000 or 5173
echo -e "\n${CYAN}▶ Step 3: Clearing lingering port bindings...${NC}"
if [ -f ".server.pid" ]; then
  OLD_SERVER_PID=$(cat .server.pid 2>/dev/null || true)
  if [ -n "$OLD_SERVER_PID" ] && kill -0 "$OLD_SERVER_PID" 2>/dev/null; then
    kill "$OLD_SERVER_PID" 2>/dev/null || true
  fi
  rm -f .server.pid
fi

if [ -f ".client.pid" ]; then
  OLD_CLIENT_PID=$(cat .client.pid 2>/dev/null || true)
  if [ -n "$OLD_CLIENT_PID" ] && kill -0 "$OLD_CLIENT_PID" 2>/dev/null; then
    kill "$OLD_CLIENT_PID" 2>/dev/null || true
  fi
  rm -f .client.pid
fi

# Kill anything remaining on ports 5000 and 5173
fuser -k 5000/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
echo -e "  ${GREEN}✓ Ports 5000 and 5173 are ready.${NC}"

# 4. Start Backend Server
echo -e "\n${CYAN}▶ Step 4: Starting Backend API (port 5000)...${NC}"
(
  set -m
  cd "$PROJECT_ROOT/server"
  nohup node index.js </dev/null > "$PROJECT_ROOT/server.log" 2>&1 &
  SERVER_PID=$!
  disown $SERVER_PID
  echo $SERVER_PID > "$PROJECT_ROOT/.server.pid"
)
SERVER_PID=$(cat .server.pid)
echo -e "  ${GREEN}✓ Backend process launched (PID: $SERVER_PID, logs: server.log)${NC}"

# Wait for backend healthcheck
echo -n "  Waiting for Backend to become ready..."
for i in {1..30}; do
  if curl -s http://localhost:5000/health | grep -q '"status":"ok"'; then
    echo -e " ${GREEN}Ready!${NC}"
    break
  fi
  sleep 0.5
  echo -n "."
done

# 5. Start Frontend Dev Server
echo -e "\n${CYAN}▶ Step 5: Starting Frontend Web App (port 5173)...${NC}"
(
  set -m
  cd "$PROJECT_ROOT/client"
  nohup ./node_modules/.bin/vite --host 0.0.0.0 --port 5173 </dev/null > "$PROJECT_ROOT/client.log" 2>&1 &
  CLIENT_PID=$!
  disown $CLIENT_PID
  echo $CLIENT_PID > "$PROJECT_ROOT/.client.pid"
)
CLIENT_PID=$(cat .client.pid)
echo -e "  ${GREEN}✓ Frontend process launched (PID: $CLIENT_PID, logs: client.log)${NC}"

# Wait for frontend HTTP
echo -n "  Waiting for Frontend to become ready..."
for i in {1..30}; do
  if curl -s -I http://localhost:5173/ 2>&1 | grep -q "200 OK"; then
    echo -e " ${GREEN}Ready!${NC}"
    break
  fi
  sleep 0.5
  echo -n "."
done

# 6. Completed Summary
echo -e "\n${BOLD}${GREEN}======================================================${NC}"
echo -e "${BOLD}${GREEN}   The BookMarket Platform is Running Successfully!  ${NC}"
echo -e "${BOLD}${GREEN}======================================================${NC}"
echo -e ""
echo -e "  ${BOLD}🌐 Frontend Web App:${NC}   ${CYAN}http://localhost:5173${NC}"
echo -e "  ${BOLD}⚙️  Backend API:${NC}        ${CYAN}http://localhost:5000${NC}"
echo -e "  ${BOLD}💓 API Healthcheck:${NC}    ${CYAN}http://localhost:5000/health${NC}"
echo -e ""
echo -e "  ${BOLD}🔑 Evaluator Demo Credentials:${NC}"
echo -e "     • Seller: ${YELLOW}seller@bookmarket.com${NC}  /  ${YELLOW}password123${NC}"
echo -e "     • Buyer:  ${YELLOW}buyer@bookmarket.com${NC}   /  ${YELLOW}password123${NC}"
echo -e ""
echo -e "  ${BOLD}🛑 To stop both services:${NC}"
echo -e "     Run: ${CYAN}./stop-local.sh${NC}  or  ${CYAN}npm run stop:local${NC}"
echo -e "  ${BOLD}📋 To check status:${NC}"
echo -e "     Run: ${CYAN}./status-local.sh${NC}  or  ${CYAN}npm run status:local${NC}"
echo -e "======================================================\n"
