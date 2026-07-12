$ErrorActionPreference = "Stop"

$edge = @(
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $edge) { throw "Microsoft Edge not found." }

$root = Resolve-Path (Join-Path $PSScriptRoot "..\public")
$proc = Start-Process -FilePath python -ArgumentList @("-m", "http.server", "4190") -WorkingDirectory $root -WindowStyle Hidden -PassThru
Start-Sleep -Seconds 1

try {
  $checks = @(
    @{ Url = "http://127.0.0.1:4190/"; Text = "Stay@Maredumilli" },
    @{ Url = "http://127.0.0.1:4190/admin.html"; Text = "Sign in to manage" },
    @{ Url = "http://127.0.0.1:4190/owner.html"; Text = "Sign in to manage" },
    @{ Url = "http://127.0.0.1:4190/book.html?room=test"; Text = "Stay@Maredumilli" },
    @{ Url = "http://127.0.0.1:4190/hotels/pushpa/"; Text = "Pushpa" }
  )

  foreach ($check in $checks) {
    $out = Join-Path $env:TEMP ("edge-smoke-" + [guid]::NewGuid() + ".html")
    $err = Join-Path $env:TEMP ("edge-smoke-" + [guid]::NewGuid() + ".log")
    Start-Process -FilePath $edge -ArgumentList @("--headless=new", "--disable-gpu", "--dump-dom", $check.Url) -RedirectStandardOutput $out -RedirectStandardError $err -Wait -WindowStyle Hidden
    $html = Get-Content -Raw -LiteralPath $out -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $out, $err -Force -ErrorAction SilentlyContinue
    if ($html -notmatch [regex]::Escape($check.Text)) {
      throw "Browser smoke failed for $($check.Url)"
    }
  }

  "Edge browser smoke passed"
} finally {
  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
