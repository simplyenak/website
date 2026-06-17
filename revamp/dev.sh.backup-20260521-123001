#!/usr/bin/env bash
set -euo pipefail

FRONTEND_PORT=4321
BACKEND_PORT=3000
REVAMP_DIR="/var/home/maarten/website-optimization/revamp"

kill_port() {
  local port=$1
  local pids
  pids=$(lsof -ti:"$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "Killing processes on port $port: $pids"
    kill $pids 2>/dev/null || true
    sleep 1
    pids=$(lsof -ti:"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
      echo "Force killing on port $port"
      kill -9 $pids 2>/dev/null || true
      sleep 1
    fi
  fi
}

kill_port "$FRONTEND_PORT"
kill_port "$BACKEND_PORT"

echo "Starting backend on port $BACKEND_PORT..."
cd "$REVAMP_DIR/backend"
nohup pnpm run dev > /tmp/backend-dev.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Starting frontend on port $FRONTEND_PORT..."
cd "$REVAMP_DIR/frontend"
nohup npx astro dev --port "$FRONTEND_PORT" --host 0.0.0.0 > /tmp/frontend-dev.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "Waiting for servers to be ready..."
for i in $(seq 1 30); do
  FE_UP=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$FRONTEND_PORT/" 2>/dev/null || echo "000")
  BE_UP=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$BACKEND_PORT/" 2>/dev/null || echo "000")
  if [ "$FE_UP" != "000" ] && [ "$BE_UP" != "000" ]; then
    echo ""
    echo "Both servers are up!"
    echo "  Frontend: http://localhost:$FRONTEND_PORT  (PID $FRONTEND_PID)"
    echo "  Backend:  http://localhost:$BACKEND_PORT  (PID $BACKEND_PID)"
    echo ""
    echo "Logs:"
    echo "  Frontend: tail -f /tmp/frontend-dev.log"
    echo "  Backend:  tail -f /tmp/backend-dev.log"
    exit 0
  fi
  printf "."
  sleep 1
done

echo ""
echo "Timed out waiting for servers. Checking status..."
echo "Frontend (port $FRONTEND_PORT): $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$FRONTEND_PORT/ 2>/dev/null || echo 'down')"
echo "Backend  (port $BACKEND_PORT): $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$BACKEND_PORT/ 2>/dev/null || echo 'down')"
echo "Check logs: /tmp/frontend-dev.log and /tmp/backend-dev.log"
exit 1
