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
echo "📋 Get your URL:"
echo "   grep -o 'https://[a-zA-Z0-9-]*\\.trycloudflare\\.com' tunnel.log"
echo ""
echo "🛑 Stop tunnel: pkill -f cloudflared"
echo "📊 Check status: ps aux | grep cloudflared"