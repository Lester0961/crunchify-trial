param(
  [Parameter(Mandatory)][ValidateSet('Protect','Unprotect')][string]$Mode,
  [Parameter(Mandatory)][string]$Path
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
if ($Mode -eq 'Protect') {
  $stream = [Console]::OpenStandardInput()
  $memory = [IO.MemoryStream]::new()
  $stream.CopyTo($memory)
  $plain = $memory.ToArray()
  $protected = [Security.Cryptography.ProtectedData]::Protect($plain, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
  [IO.File]::WriteAllBytes($Path, $protected)
  [Array]::Clear($plain, 0, $plain.Length)
} else {
  $protected = [IO.File]::ReadAllBytes($Path)
  $plain = [Security.Cryptography.ProtectedData]::Unprotect($protected, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser)
  $output = [Console]::OpenStandardOutput()
  $output.Write($plain, 0, $plain.Length)
  $output.Flush()
  [Array]::Clear($plain, 0, $plain.Length)
}
