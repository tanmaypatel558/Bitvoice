@echo off
echo Manual GitHub Sync for Pizza Shop
echo.
echo This will commit and push all current changes to GitHub.
echo.

cd /d "%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "auto-sync.ps1"

echo.
echo Sync completed!
pause 