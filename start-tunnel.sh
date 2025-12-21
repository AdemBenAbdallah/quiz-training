#!/bin/bash
echo "🚀 Starting Cloudflare Tunnel for localhost:3000..."

# Kill existing tunnel
pkill -f cloudflared 2>/dev/null
sleep 1

# Start tunnel
./cloudflared tunnel --url http://localhost:3000 2>&1 | tee tunnel.log &

echo "⏳ Waiting 8 seconds..."
sleep 8

echo "✅ Tunnel started!"
echo ""

# Extract URL from log and copy to clipboard
TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' tunnel.log | head -n1)

if [ -n "$TUNNEL_URL" ]; then
    # Try different clipboard tools
    if command -v xclip &> /dev/null; then
        echo "$TUNNEL_URL" | xclip -selection clipboard
        echo "📋 URL copied to clipboard: $TUNNEL_URL"
    elif command -v wl-copy &> /dev/null; then
        echo "$TUNNEL_URL" | wl-copy
        echo "📋 URL copied to clipboard: $TUNNEL_URL"
    elif command -v pbcopy &> /dev/null; then
        echo "$TUNNEL_URL" | pbcopy
        echo "📋 URL copied to clipboard: $TUNNEL_URL"
    else
        echo "📋 Tunnel URL: $TUNNEL_URL"
        echo "   (Install xclip, wl-copy, or pbcopy for auto-copy)"
    fi
else
    echo "⚠️  Could not extract tunnel URL from log"
    echo "   Manual extraction: grep -o 'https://[a-zA-Z0-9-]*\\.trycloudflare\\.com' tunnel.log"
fi

echo ""
echo "🛑 Stop tunnel: pkill -f cloudflared"
echo "📊 Check status: ps aux | grep cloudflared"
