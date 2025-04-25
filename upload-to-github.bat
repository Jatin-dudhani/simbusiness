@echo off
echo Uploading changes to GitHub...

cd /d "%~dp0"
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "Update site with new features"
"C:\Program Files\Git\bin\git.exe" push

echo.
echo If successful, your updated site is now on GitHub!
echo.
echo Press any key to exit
pause 