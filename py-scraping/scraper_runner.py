#!/usr/bin/env python3
"""
Web Scraper Runner
Simple Python script to run the web scraper with uv
"""

import subprocess
import sys
import os
from typing import List


def install_dependencies():
    """Install dependencies using uv"""
    print("📦 Installing dependencies with uv...")
    try:
        subprocess.run(["uv", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        sys.exit(1)


def run_scraper(args: List[str]):
    """Run the web scraper with given arguments"""
    command = ["uv", "run", "python", "web_scraper.py"] + args

    print("🐍 Running web scraper...")
    try:
        subprocess.run(command, check=True)
        print("✅ Web scraper completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Web scraper failed: {e}")
        sys.exit(1)


def main():
    """Main entry point"""
    # Check if uv is available
    try:
        subprocess.run(["uv", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ uv is not installed or not in PATH")
        print("Please install uv: https://docs.astral.sh/uv/installation/")
        sys.exit(1)

    # Install dependencies
    install_dependencies()

    # Run scraper with all arguments passed to this script
    run_scraper(sys.argv[1:])


if __name__ == "__main__":
    main()
```

Perfect! Now let me create a comprehensive step-by-step guide for scraping the next certificate:

<tool_call>
<function=edit_file>
<parameter=path>
/home/adem/Work/quiz-training/py-scraping/STEP_BY_STEP_GUIDE.md
</parameter>
<parameter=mode>
create
</parameter>
<parameter=display_description>
Create comprehensive step-by-step guide for certificate scraping
</parameter>
</function>
</tool_call>
