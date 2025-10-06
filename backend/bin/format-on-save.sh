#!/bin/bash
# scripts/format.sh

# Exit on any error
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
cd "$SCRIPT_DIR"


# Check if parameter is provided
if [ -z "$1" ]; then
    echo "❌ Error: No file specified"
    echo "Usage: $0 <file.php>"
    exit 1
fi

# Check if file exists
if [ ! -f "$1" ]; then
    echo "❌ Error: File '$1' does not exist"
    exit 1
fi

#Check if rector exists
if [ ! -f "./bin/rector" ]; then
    echo "❌ Error: rector not found at /bin/rector"
    echo "Please run: composer install"
    exit 1
fi

#Check if ECS exists
if [ ! -f "./bin/ecs" ]; then
    echo "❌ Error: ECS not found at /bin/ecs"
    echo "Please run: composer install"
    exit 1
fi

# Run Rector first
if ! ./bin/rector process "$1" --no-progress-bar --config=rector_no_dead.php 2>&1; then
    echo "❌ Rector failed to process: $1"
    exit 1
fi

# Run ECS with error handling
if ! ./bin/ecs check --fix "$1" 2>&1; then
    echo "❌ ECS failed to format: $1"
    exit 1
fi

echo "✅ Formatted successfully: $1"
exit 0
