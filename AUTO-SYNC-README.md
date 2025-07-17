# Auto-Sync to GitHub Setup

This project has been configured with automatic GitHub synchronization. Your code will automatically be committed and pushed to your GitHub repository at: https://github.com/tanmaypatel558/Bitvoice.git

## 🚀 Quick Start

### Option 1: Automatic File Watching (Recommended)
1. Double-click `start-auto-sync.bat`
2. The script will start watching for file changes
3. When you modify any file, it will automatically commit and push to GitHub after a 10-second delay
4. Press `Ctrl+C` to stop the auto-sync

### Option 2: Manual Sync
1. Double-click `manual-sync.bat` whenever you want to sync changes
2. This will immediately commit and push all current changes to GitHub

### Option 3: PowerShell Commands
```powershell
# For automatic watching
.\watch-and-sync.ps1

# For manual sync
.\auto-sync.ps1

# For custom commit message
.\auto-sync.ps1 -CommitMessage "Your custom commit message"
```

## 📁 Files Created

- `auto-sync.ps1` - Core sync script that commits and pushes changes
- `watch-and-sync.ps1` - File watcher that automatically triggers sync
- `start-auto-sync.bat` - Windows batch file to start auto-sync easily
- `manual-sync.bat` - Windows batch file for manual sync
- `AUTO-SYNC-README.md` - This instructions file

## ⚙️ Configuration

### Excluded Files/Folders
The auto-sync automatically excludes these patterns:
- `*.tmp`, `*.log` (temporary files)
- `node_modules` (dependencies)
- `.git` (git internal files)
- `.next` (Next.js build files)
- `dist`, `build` (build output)

### Customization
You can modify the `watch-and-sync.ps1` script to:
- Change the sync delay (default: 10 seconds)
- Add/remove excluded patterns
- Change the watch path

## 🔧 Troubleshooting

### PowerShell Execution Policy
If you get execution policy errors, run this command in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Authentication Issues
- Make sure you're authenticated with GitHub
- You may need to use a Personal Access Token instead of password
- Configure Git credentials: `git config --global credential.helper manager-core`

### Network Issues
- Ensure you have internet connection
- Check if GitHub is accessible
- Verify repository URL is correct

## 💡 Usage Tips

1. **Start auto-sync when you begin working** - Run `start-auto-sync.bat` at the start of your development session
2. **Let it run in the background** - The file watcher will handle all syncing automatically
3. **Check the console output** - The script shows helpful status messages
4. **Use meaningful commit messages** - For important changes, use manual sync with custom messages

## 🛑 Stopping Auto-Sync

To stop the auto-sync process:
1. Press `Ctrl+C` in the PowerShell window
2. Or simply close the PowerShell window

## 📊 What Gets Synced

- All code changes (`.ts`, `.tsx`, `.js`, `.jsx`, etc.)
- Configuration files (`.json`, `.yml`, `.yaml`, etc.)
- Style files (`.css`, `.scss`, etc.)
- Documentation files (`.md`)
- Any other project files

**Note:** Build files, dependencies, and temporary files are automatically excluded.

---

Your project is now ready for automatic GitHub synchronization! 🎉 