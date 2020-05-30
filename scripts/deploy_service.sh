#!/usr/bin/env bash

PORT=${PORT:-'3333'}

if PROCESS_ID=$( lsof -i :"$PORT" -t ) ; then
  echo "Killing process $PROCESS_ID occupying port $PORT"
  kill "$PROCESS_ID"
else
  echo "No currently running process on port $PORT"
fi

ERROR_FILE="./process.err"
LOG_FILE="./process.out"

if [ -s "$ERROR_FILE" ]; then
  rm "$ERROR_FILE"
fi

PORT=$PORT nohup node ./lib/index.js > "$LOG_FILE" 2> "$ERROR_FILE" < /dev/null &

sleep 15

if PROCESS_ID=$( lsof -i :"$PORT" -t ) ; then
  echo "Application available at port $PORT"
  echo "Standard output log:"
  cat "$LOG_FILE"
else
  echo "No currently running process on port $PORT"
  echo "Standard output log:"
  cat "$LOG_FILE"
  echo "Error log:"
  cat "$ERROR_FILE"
  exit 1
fi
