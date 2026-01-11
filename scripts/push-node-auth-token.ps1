# Pushes env variables from a dotenv file into Vercel for a single environment.
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("development", "preview", "production")]
    [string]$Environment,

    [string]$FilePath = ".env.local",

    [switch]$IncludeNodeAuth
)

if (-not (Get-Command vc -ErrorAction SilentlyContinue)) {
    Write-Error "Vercel CLI (vc) is not available on PATH."
    exit 1
}

if (-not (Test-Path -LiteralPath $FilePath)) {
    Write-Error "Could not find dotenv file at '$FilePath'."
    exit 1
}

$rawLines = Get-Content -LiteralPath $FilePath
$envEntries = @{}

foreach ($line in $rawLines) {
    $trimmed = $line.Trim()
    if (-not $trimmed) { continue }
    if ($trimmed.StartsWith("#")) { continue }

    $splitIndex = $trimmed.IndexOf("=")
    if ($splitIndex -lt 1) { continue }

    $key = $trimmed.Substring(0, $splitIndex).Trim()
    $value = $trimmed.Substring($splitIndex + 1).Trim()

    if (-not $key) { continue }

    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
        $value = $value.Trim('"')
    }

    $envEntries[$key] = $value
}

if ($IncludeNodeAuth -and $env:NODE_AUTH_TOKEN) {
    $envEntries["NODE_AUTH_TOKEN"] = $env:NODE_AUTH_TOKEN
}

if ($envEntries.Count -eq 0) {
    Write-Warning "No environment variables were found to push."
    exit 0
}

foreach ($entry in $envEntries.GetEnumerator()) {
    $key = $entry.Key
    $value = $entry.Value

    if ($null -eq $value -or $value -eq '') {
        Write-Warning "Skipping '$key' because it has no value."
        continue
    }

    Write-Host "Pushing $key to $Environment..."
    $inputLines = @("y", $value)
    $inputLines | vc env add $key $Environment | Out-Host

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to push '$key' to Vercel."
        exit $LASTEXITCODE
    }
}

Write-Host "Completed pushing environment variables to Vercel." -ForegroundColor Green
