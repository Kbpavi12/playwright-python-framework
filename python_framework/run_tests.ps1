Param(
    [switch]$Headed
)
Set-StrictMode -Version Latest
Push-Location -LiteralPath $PSScriptRoot
python -m venv .venv
& .\.venv\Scripts\python.exe -m pip install --upgrade pip
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt
& .\.venv\Scripts\python.exe -m playwright install chromium
if ($Headed) { $env:HEADLESS = '0' } else { $env:HEADLESS = '1' }
if (-not (Test-Path reports)) { New-Item -ItemType Directory -Path reports | Out-Null }
& .\.venv\Scripts\python.exe -m pytest tests -q --junitxml=reports\junit.xml
Pop-Location
