# AIDO Quick Start Guide

One-click startup scripts for macOS and Linux Ubuntu.

## 🚀 Quick Start

### macOS

**Option 1: One-Click Start**
1. Double-click `start.command`
2. The application will automatically:
   - Install dependencies (first time only)
   - Start the server
   - Open your browser to http://localhost:5173

**Option 2: Manual Installation**
1. Double-click `install.command` (first time only)
2. Then double-click `start.command` to start

### Linux Ubuntu

**Option 1: Desktop Icon**
1. Double-click `AIDO.desktop`
2. Select "Trust and Launch" or "Run" when prompted
3. The application will automatically:
   - Install dependencies (first time only)
   - Start the server
   - Open your browser to http://localhost:5173

**Option 2: Terminal**
```bash
# First time only
./install.sh

# Start the application
./start.sh
```

**Option 3: Add to Desktop**
```bash
# Copy to your desktop for easy access
cp AIDO.desktop ~/Desktop/
chmod +x ~/Desktop/AIDO.desktop
```

## 📋 Prerequisites

Before running AIDO, make sure you have Node.js installed:

### macOS
```bash
# Check if Node.js is installed
node --version

# Install with Homebrew
brew install node

# Or download from: https://nodejs.org/
```

### Linux Ubuntu
```bash
# Check if Node.js is installed
node --version

# Install with apt
sudo apt update
sudo apt install nodejs npm

# Or download from: https://nodejs.org/
```

## 🎯 Using AIDO

Once the application starts, you'll see the AIDO interface at http://localhost:5173

### Main Features

1. **Agent Network** - Create AI-powered proposals
2. **Decision Making** - Evaluate proposals with AI
3. **Consensus** - Reach consensus on proposals
4. **Task Allocation** - Assign tasks to agents
5. **Task Board** - 4-column Kanban board with drag-and-drop
6. **Performance Monitoring** - Track system metrics

### Task Board (Kanban)

The Task Board provides a visual overview of all tasks:

- **To Do** - Pending tasks
- **In Progress** - Active tasks
- **Review** - Tasks under review
- **Done** - Completed tasks

**Features:**
- Drag and drop tasks between columns
- Tasks sorted by priority (highest at top)
- Visual priority badges
- Agent assignments displayed
- Responsive design for all screen sizes

## 🛑 Stopping AIDO

Press `Ctrl+C` in the terminal window to stop the server.

## 🔧 Troubleshooting

### Port Already in Use

If you see "Port 5173 is already in use":

```bash
# Find and kill the process using port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear npm cache and reinstall
cd src
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Browser Doesn't Open Automatically

Manually open your browser and navigate to:
```
http://localhost:5173
```

## 📚 More Information

- **Main README**: See [README.md](README.md) for project overview
- **AI Assistant Guide**: See [CLAUDE.md](CLAUDE.md) for development details
- **Documentation**: See [docs/](docs/) for technical documentation

## 💡 Tips

1. **First Run**: The first time you run AIDO, it will install dependencies. This takes 2-5 minutes.

2. **Subsequent Runs**: After the first run, startup takes only a few seconds.

3. **Development Mode**: The scripts start AIDO in development mode with hot-reload. Changes to code will automatically refresh.

4. **Production Build**: To build for production:
   ```bash
   cd src
   npm run build
   ```

## 🆘 Support

If you encounter issues:

1. Make sure Node.js (v16 or higher) is installed
2. Check that ports 5173 is available
3. Try running `install.command` / `install.sh` again
4. Check the console output for error messages

---

**Ready to start?** Just double-click the startup file for your OS! 🚀
