param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action
)

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
$PidFile = Join-Path $ProjectRoot ".crm.pid"
$LogFile = Join-Path $ProjectRoot "crm-server.log"

# Wykrywanie Pythona (priorytet dla środowiska wirtualnego .venv)
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
            if ($proc) {
                return $proc.Id
            }
        }
        # Jeśli proces nie istnieje, usuń martwy plik PID
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    }
    return $null
}

function Cleanup-Orphans {
    Write-Host "Czyszczenie osieroconych procesow..." -ForegroundColor DarkGray
    # Kill by command line
    $orphans = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match "uvicorn app.main:app" }
    foreach ($orphan in $orphans) {
        Stop-Process -Id $orphan.ProcessId -Force -ErrorAction SilentlyContinue
    }
    # Kill by port (8080)
    $portProcs = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
    foreach ($p in $portProcs) {
        Stop-Process -Id $p.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

function Start-Server {
    Cleanup-Orphans
    $existingPid = Get-ServerPid
    if ($existingPid) {
        Write-Host "Serwer juz dziala (PID: $existingPid)." -ForegroundColor Yellow
        return
    }

    Write-Host "Uruchamianie serwera CRM..." -ForegroundColor Cyan

    # Wczytaj zmienne z .env i ustaw w bieżącym procesie
    $EnvFile = Join-Path $ProjectRoot ".env"
    if (Test-Path $EnvFile) {
        Get-Content $EnvFile | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#") -and $line -match "^([^=]+)=(.*)$") {
                $key = $Matches[1].Trim()
                $val = $Matches[2].Trim().Trim('"').Trim("'")
                [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
            }
        }
    }

    $ErrFile = Join-Path $ProjectRoot "crm-server-error.log"
    $UvicornArgs = "-m uvicorn app.main:app --host 127.0.0.1 --port 8080"
    
    $CrmEnv = [System.Environment]::GetEnvironmentVariable("CRM_ENV", "Process")
    if ($CrmEnv -ne "production") {
        $UvicornArgs += " --reload --reload-include `"*.html`" --reload-include `"*.css`""
        $ReloadStatus = "ACTIVE"
    } else {
        $ReloadStatus = "DISABLED (production mode)"
    }

    $Process = Start-Process -FilePath $PythonExe -ArgumentList $UvicornArgs -WorkingDirectory $ProjectRoot -PassThru -WindowStyle Hidden -RedirectStandardOutput $LogFile -RedirectStandardError $ErrFile

    Start-Sleep -Seconds 2
    if (-not $Process.HasExited) {
        $Process.Id | Out-File -FilePath $PidFile -Encoding ASCII
        Write-Host "Serwer uruchomiony pomyslnie w tle (PID: $($Process.Id))." -ForegroundColor Green
        Write-Host "Logi serwera: $LogFile" -ForegroundColor DarkGray
        Write-Host "Automatyczne przeladowywanie (hot-reload): $ReloadStatus." -ForegroundColor Blue
    } else {
        Write-Host "Nie udalo sie uruchomic serwera. Sprawdz plik $LogFile." -ForegroundColor Red
    }
}

function Stop-Server {
    $id = Get-ServerPid
    if ($id) {
        Write-Host "Zatrzymywanie serwera (PID: $id)..." -ForegroundColor Cyan
        Stop-Process -Id $id -Force -ErrorAction SilentlyContinue
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        Cleanup-Orphans
        Write-Host "Serwer zostal zatrzymany." -ForegroundColor Green
    } else {
        Write-Host "Serwer aktualnie nie dziala." -ForegroundColor Yellow
        Cleanup-Orphans
    }
}

function Show-Status {
    $id = Get-ServerPid
    if ($id) {
        Write-Host "Serwer jest URUCHOMIONY i dziala w tle (PID: $id)." -ForegroundColor Green
    } else {
        Write-Host "Serwer jest ZATRZYMANY." -ForegroundColor Red
    }
}

switch ($Action) {
    "start" { Start-Server }
    "stop" { Stop-Server }
    "restart" { Stop-Server; Start-Sleep -Seconds 1; Start-Server }
    "status" { Show-Status }
}
