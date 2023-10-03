@echo off
set path2add=';C:\MinGW\mingw64\bin;'
set systemPath=%PATH%

echo %PATH% | find /i "%path2add%" > nul
if errorlevel 1 (
   set systemPath=%systemPath%%path2add%
   set systemPath=%systemPath:~0,-1%
   setx PATH "%systemPath%"
   echo Added to path!
   echo %systemPath%
) else (
   echo Path already contains the specified path.
)