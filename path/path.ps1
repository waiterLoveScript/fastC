$path2add = ';C:\MinGW\mingw64\bin'
$systemPath = [Environment]::GetEnvironmentVariable('Path', 'user');
If (!$systemPath.contains($path2add)) {
    $systemPath += $path2add
    $systemPath = $systemPath -join ';'
    [Environment]::SetEnvironmentVariable('Path', $systemPath, 'User');
    Write-Host "Finished! Congratulations!" -ForegroundColor Green
}