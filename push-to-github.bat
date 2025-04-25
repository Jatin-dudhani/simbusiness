@echo off
echo Pushing to GitHub...

set GIT="C:\Program Files\Git\bin\git.exe"

echo Enter your GitHub repository URL (https://github.com/YourUsername/simbusiness.git):
set /p REPO_URL=

%GIT% remote add origin %REPO_URL%
%GIT% push -u origin master

echo.
echo If successful, your code is now on GitHub!
echo.
echo Press any key to exit
pause 