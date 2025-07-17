#!/usr/bin/env pwsh

# Auto-sync script for pizza-shop project
# This script will automatically commit and push changes to GitHub

param(
    [string]$CommitMessage = "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "Starting auto-sync process..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Check git status
$gitStatus = git status --porcelain
if (-not $gitStatus) {
    Write-Host "No changes to commit" -ForegroundColor Yellow
    exit 0
}

Write-Host "Changes detected, committing..." -ForegroundColor Blue

# Add all changes
git add .

# Commit changes
git commit -m $CommitMessage

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Blue
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully synced to GitHub!" -ForegroundColor Green
} else {
    Write-Host "Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host "Auto-sync completed!" -ForegroundColor Green 