param(
  [string]$SourceDir = "D:\AICoach\plan\garmin-workouts",
  [string]$DeviceName = "Forerunner 965",
  [ValidateSet('NewFiles','Workouts')]
  [string]$Target = 'NewFiles',
  [int]$PerFileDelayMs = 900,
  [switch]$Strict
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $SourceDir)) {
  throw "Source folder not found: $SourceDir"
}

$files = Get-ChildItem -LiteralPath $SourceDir -Filter *.fit -File
if ($files.Count -eq 0) {
  throw "No .fit files found in $SourceDir"
}

$shell = New-Object -ComObject Shell.Application
$pc = $shell.Namespace('shell:MyComputerFolder')

$device = $pc.Items() | Where-Object {
  $_.Name -eq $DeviceName -or $_.Name -match 'Garmin|Forerunner|Fenix|Instinct|Edge'
} | Select-Object -First 1

if (-not $device) {
  throw 'No Garmin MTP device found in My Computer.'
}

$watchFolder = $device.GetFolder
$internal = $watchFolder.Items() | Where-Object { $_.Name -eq 'Internal Storage' } | Select-Object -First 1
if (-not $internal) {
  throw 'Internal Storage folder not found on Garmin device.'
}

$internalFolder = $internal.GetFolder
$garmin = $internalFolder.Items() | Where-Object { $_.Name -eq 'GARMIN' } | Select-Object -First 1
if (-not $garmin) {
  throw 'GARMIN folder not found on device.'
}

$garminFolder = $garmin.GetFolder
$targetItem = $garminFolder.Items() | Where-Object { $_.Name -eq $Target } | Select-Object -First 1
if (-not $targetItem) {
  throw "GARMIN/$Target folder not found on device."
}

$targetFolder = $targetItem.GetFolder

# Avoid silent no-op when same filename already exists on device.
foreach ($f in $files) {
  $existing = $targetFolder.Items() | Where-Object { $_.Name -eq $f.Name } | Select-Object -First 1
  if ($existing) {
    $existing.InvokeVerb('delete')
  }
}

Start-Sleep -Milliseconds 400

foreach ($f in $files) {
  $targetFolder.CopyHere($f.FullName)
  Start-Sleep -Milliseconds $PerFileDelayMs
}

# MTP CopyHere is asynchronous; immediate verification may miss files even when
# transfer succeeds a few seconds later.
$deviceNames = @($targetFolder.Items() | ForEach-Object { $_.Name })
$missing = @()
foreach ($f in $files) {
  if ($deviceNames -contains $f.Name) {
    Write-Output "COPIED $($f.Name)"
  } else {
    $missing += $f.Name
  }
}

if ($missing.Count -gt 0) {
  $msg = "Copy queued via MTP to GARMIN/$Target. Some files are not visible yet: " + ($missing -join ', ')
  if ($Strict) {
    throw $msg
  }
  Write-Warning $msg
  Write-Output "Done. Submitted $($files.Count) workout file(s) to GARMIN/$Target on $($device.Name)."
  exit 0
}

Write-Output "Done. Copied $($files.Count) workout file(s) to GARMIN/$Target on $($device.Name)."
