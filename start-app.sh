#!/bin/bash

# Start the dispatch application
cd /opt/dispatch

echo "🚀 Starting Dispatch Application..."
echo "📍 Domain: dispatch.forbush.biz"
echo "🔌 Internal Port: 3333"
echo "🌐 Public Port: 80 (via nginx)"

# Check if database is running
if ! docker ps | grep -q dispatch-postgres; then
    echo "🗄️  Starting PostgreSQL database..."
    docker compose up -d postgres
    sleep 3
fi

# Check if app is already running
if lsof -i :3333 > /dev/null 2>&1; then
    echo "⚠️  Application already running on port 3333"
    echo "🔄 Stopping existing process..."
    pkill -f "next-server"
    sleep 2
fi

# Start the application
echo "🎯 Starting Next.js application..."
npm run build
nohup npm run start > /var/log/dispatch-app.log 2>&1 &

# Wait a moment for startup
sleep 3

# Check if the app started successfully
if lsof -i :3333 > /dev/null 2>&1; then
    echo "✅ Application started successfully!"
    echo "🌐 Available at: http://dispatch.forbush.biz"
    echo "📋 Logs: tail -f /var/log/dispatch-app.log"
    echo ""
    echo "🔐 Demo Login Credentials:"
    echo "• admin@dispatch.com / password (Admin)"
    echo "• dispatcher@dispatch.com / password (Dispatcher)"
    echo "• tech1@dispatch.com / password (Technician)"
else
    echo "❌ Failed to start application"
    echo "📋 Check logs: tail -f /var/log/dispatch-app.log"
    exit 1
fi