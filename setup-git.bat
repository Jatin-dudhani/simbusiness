@echo off
echo Setting up Git repository...

set GIT="C:\Program Files\Git\bin\git.exe"

%GIT% init
%GIT% add .
%GIT% commit -m "Initial commit"

echo.
echo Repository initialized locally.
echo.
echo Next steps:
echo 1. Create a new repository on GitHub (Don't initialize with README, .gitignore, or license)
echo 2. Copy the repository URL
echo 3. Run the following commands in Git Bash:
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin master
echo.
echo Press any key to exit
pause 