#!/usr/bin/env pwsh

# File watcher script for automatic GitHub sync
# This script watches for file changes and automatically commits/pushes to GitHub

param(
    [int]$DelaySeconds = 10,  # Delay before sync after file change
    [string]$WatchPath = ".",  # Path to watch for changes
    [string[]]$ExcludePatterns = @("*.tmp", "*.log", "node_modules", ".git", ".next", "dist", "build")
)

Write-Host "Starting file watcher for auto-sync..." -ForegroundColor Green
Write-Host "Watching path: $WatchPath" -ForegroundColor Blue
Write-Host "Sync delay: $DelaySeconds seconds" -ForegroundColor Blue
Write-Host "Excluding: $($ExcludePatterns -join ', ')" -ForegroundColor Blue
Write-Host "Press Ctrl+C to stop..." -ForegroundColor Yellow

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = Resolve-Path $WatchPath
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Variables for debouncing
$lastChangeTime = Get-Date
$syncTimer = $null

# Function to check if path should be excluded
function ShouldExcludePath($path) {
    foreach ($pattern in $ExcludePatterns) {
        if ($path -like "*$pattern*") {
            return $true
        }
    }
    return $false
}

# Function to perform sync
function Invoke-Sync {
    try {
        Write-Host "Starting sync process..." -ForegroundColor Cyan
        & ".\auto-sync.ps1"
    } catch {
        Write-Host "Sync failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Event handler for file changes
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # Skip if path should be excluded
    if (ShouldExcludePath $path) {
        return
    }
    
    Write-Host "File changed: $path ($changeType)" -ForegroundColor Gray
    
    # Update last change time
    $global:lastChangeTime = Get-Date
    
    # Cancel existing timer if any
    if ($global:syncTimer) {
        $global:syncTimer.Stop()
        $global:syncTimer.Dispose()
    }
    
    # Create new timer
    $global:syncTimer = New-Object System.Timers.Timer
    $global:syncTimer.Interval = $DelaySeconds * 1000
    $global:syncTimer.AutoReset = $false
    
    # Timer event handler
    $timerAction = {
        Write-Host "Sync delay completed, starting sync..." -ForegroundColor Yellow
        Invoke-Sync
    }
    
    Register-ObjectEvent -InputObject $global:syncTimer -EventName Elapsed -Action $timerAction | Out-Null
    $global:syncTimer.Start()
}

# Register event handlers
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action | Out-Null

Write-Host "File watcher is active and ready!" -ForegroundColor Green

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Cleanup
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    if ($syncTimer) {
        $syncTimer.Stop()
        $syncTimer.Dispose()
    }
    Write-Host "File watcher stopped." -ForegroundColor Red
} 