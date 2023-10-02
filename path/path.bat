@echo off
set "new_path=C:\MinGW\mingw64\bin"

REM Check if the path already exists in the PATH environment variable
echo %PATH% | find /i "%new_path%" > nul
if errorlevel 1 (
  REM If the path doesn't exist, add it to the PATH
  setx PATH "%PATH%;%new_path%"
  echo Path added to the system PATH variable.
) else (
  echo Path already exists in the system PATH variable.
)
