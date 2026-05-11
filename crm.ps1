param(
    [Parameter(Mandatory=$false, Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "translate", "run", "dev")]
    [string]$Action = "status",

    [Parameter(Mandatory=$false, Position=1)]
    [string]$Param1,

    [Parameter(Mandatory=$false, Position=2)]
    [string]$Param2,

    [Parameter(ValueFromRemainingArguments=$true)]
    $ExtraArgs
)

$ErrorActionPreference = "Stop"

# Hardcoded project root to allow running from anywhere
$ProjectRoot = "C:\Users\xxx\crm-portal"
Set-Location $ProjectRoot

$PidFile = Join-Path $ProjectRoot ".crm.pid"
$LogFile = Join-Path $ProjectRoot "crm-server.log"

# Wykrywanie Pythona
$VenvPython = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
if (Test-Path $VenvPython) {
    $PythonExe = $VenvPython
} else {
    $PythonExe = "python"
}

function Get-ServerPid {
    if (Test-Path $PidFile) {
        $id = Get-Content $PidFile -ErrorAction SilentlyContinue
        if ($id -match '^\d+$') {
            $proc = Get-Process -Id $id -ErrorAction SilentlyContinue
            if ($proc) { return $proc.Id }
        }
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    return $null
}

function Cleanup-Orphans {
    Write-Host "Cleanup: checking for orphaned uvicorn processes..." -ForegroundColor DarkGray
    $orphans = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match "uvicorn app.main:app" }
    foreach ($orphan in $orphans) { Stop-Process -Id $orphan.ProcessId -Force -ErrorAction SilentlyContinue }
}

function Start-Server {
    Cleanup-Orphans
    $existingPid = Get-ServerPid
    if ($existingPid) {
        Write-Host "Server is already running (PID: $existingPid)." -ForegroundColor Yellow
        return
    }

    Write-Host "Starting CRM Backend..." -ForegroundColor Cyan
    $ErrFile = Join-Path $ProjectRoot "crm-server-error.log"
    $UvicornArgs = "-m uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload"
    
    $Process = Start-Process -FilePath $PythonExe -ArgumentList $UvicornArgs -WorkingDirectory $ProjectRoot -PassThru -WindowStyle Hidden -RedirectStandardOutput $LogFile -RedirectStandardError $ErrFile

    Start-Sleep -Seconds 2
    if (-not $Process.HasExited) {
        $Process.Id | Out-File -FilePath $PidFile -Encoding ASCII
        Write-Host "Server started in background (PID: $($Process.Id))." -ForegroundColor Green
    } else {
        Write-Host "Failed to start server. Check $LogFile" -ForegroundColor Red
    }
}

function Run-Translation {
    param($src, $dest)
    Write-Host "Starting AI Translation..." -ForegroundColor Cyan
    $args = "translate_to_ts.py"
    if ($src) { $args += " --src $src" }
    if ($dest) { $args += " --dest $dest" }
    
    & $PythonExe $args
}

function Run-Custom {
    param($script, $extra)
    if (-not $script) {
        Write-Host "Usage: crm run <script_name.py> [args...]" -ForegroundColor Yellow
        return
    }
    Write-Host "Executing: $script $extra" -ForegroundColor Cyan
    & $PythonExe $script $extra
}

function Start-Dev-Frontend {
    Write-Host "Starting Nuxt Frontend (Dev)..." -ForegroundColor Cyan
    Set-Location (Join-Path $ProjectRoot "crm-portal-ts/frontend")
    npm run dev
}

switch ($Action) {
    "start" { Start-Server }
    "stop" { 
        $id = Get-ServerPid
        if ($id) { Stop-Process -Id $id -Force; Remove-Item $PidFile -Force; Write-Host "Server stopped." -ForegroundColor Green }
        else { Write-Host "Server not running." -ForegroundColor Yellow }
    }
    "restart" { 
        Invoke-Expression ".\crm.ps1 stop"
        Start-Sleep -Seconds 1
        Start-Server 
    }
    "status" { 
        $id = Get-ServerPid
        if ($id) { Write-Host "CRM Server is RUNNING (PID: $id)" -ForegroundColor Green }
        else { Write-Host "CRM Server is STOPPED" -ForegroundColor Red }
    }
    "translate" { Run-Translation $Param1 $Param2 }
    "run" { Run-Custom $Param1 ($Param2 + " " + $ExtraArgs) }
    "dev" { Start-Dev-Frontend }
}
