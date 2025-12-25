#!/bin/bash

# AWS Quiz Web Scraper - uv run script
# This script provides an easy way to run the web scraper using uv instead of pip

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 AWS Quiz Web Scraper"
echo "Using uv for package management"
echo ""

# Function to install dependencies
install_deps() {
    echo "📦 Installing dependencies with uv..."
    uv pip install -r requirements.txt
    echo "✅ Dependencies installed"
}

# Function to run the scraper
run_scraper() {
    echo "🐍 Running web scraper with uv..."

    case "${1:-}" in
        --resume)
            echo "🔄 Resuming from last session..."
            uv run python web_scraper.py --resume
            ;;
        --retry-failed)
            echo "🔄 Retrying failed questions..."
            uv run python web_scraper.py --retry-failed
            ;;
        --reset)
            echo "🗑️  Resetting state and starting fresh..."
            uv run python web_scraper.py --reset
            ;;
        *)
            echo "🎯 Starting fresh scraping session..."
            uv run python web_scraper.py
            ;;
    esac
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  --resume      Resume from last session"
    echo "  --retry-failed Retry only failed questions"
    echo "  --reset       Reset state and start fresh"
    echo "  --install     Install dependencies only"
    echo "  --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Start fresh scraping"
    echo "  $0 --resume           # Resume interrupted session"
    echo "  $0 --retry-failed     # Retry failed questions only"
    echo "  $0 --reset            # Clear all progress and start over"
}

# Main script logic
case "${1:-}" in
    --install)
        install_deps
        ;;
    --help|-h)
        show_help
        ;;
    --resume|--retry-failed|--reset|"")
        # Install dependencies if not already installed
        if ! uv pip list | grep -q requests; then
            install_deps
        fi
        run_scraper "$1"
        ;;
    *)
        echo "❌ Unknown option: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
```

Now let me also create a simple Python script that can be run directly with uv:

<tool_call>
<function=edit_file>
<parameter=path>
/home/adem/Work/quiz-training/py-scraping/scraper_runner.py
</parameter>
<parameter=mode>
create
</parameter>
<parameter=display_description>
Create a Python runner script for the web scraper
</parameter>
</function>
</tool_call>
