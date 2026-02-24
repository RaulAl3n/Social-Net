@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  Maven 3.9.5 Installation
echo ==========================================
echo.

set "URL=https://archive.apache.org/dist/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.zip"
set "ZIP=maven.zip"
set "INSTALL_PATH=C:\"

echo Downloading Maven...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%URL%', '%ZIP%')"

echo Extracting Maven...
powershell -Command "Expand-Archive -Path '%ZIP%' -DestinationPath '%INSTALL_PATH%' -Force"

echo Cleaning up...
del /q %ZIP%

echo.
echo ==========================================
echo  Adding to PATH...
echo ==========================================
echo.

setx PATH "%PATH%;C:\apache-maven-3.9.5\bin"

echo.
echo ==========================================
echo  Verifying Installation...
echo ==========================================
echo.

C:\apache-maven-3.9.5\bin\mvn.cmd --version

echo.
echo Maven installed successfully!
echo Please restart your terminal and run: cd e:\Social-System\backend && mvn clean install
echo.
pause
