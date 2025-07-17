@echo off
echo Starting Pizza Shop Auto-Sync...
echo.
echo This will automatically commit and push changes to GitHub when files are modified.
echo Press Ctrl+C to stop the auto-sync process.
echo.
pause

cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "watch-and-sync.ps1"

pause 