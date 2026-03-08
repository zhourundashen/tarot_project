@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo   Tarot Project Upload Script
echo ========================================
echo.

set SERVER_IP=119.29.233.29
set SERVER_USER=ubuntu
set PROJECT_DIR=/var/www/tarot

echo Server: %SERVER_IP%
echo User: %SERVER_USER%
echo Target: %PROJECT_DIR%
echo.

echo Checklist:
echo 1. SSH access is working
echo 2. You are in project root directory
echo.

pause

echo.
echo [1/3] Creating directories...
ssh %SERVER_USER%@%SERVER_IP% "sudo mkdir -p %PROJECT_DIR% && sudo chown -R %SERVER_USER%:%SERVER_USER% %PROJECT_DIR%"

echo.
echo [2/3] Uploading files...
echo This may take a few minutes...
echo.

echo Uploading frontend...
scp -r frontend %SERVER_USER%@%SERVER_IP%:%PROJECT_DIR%/

echo Uploading backend...
scp -r backend %SERVER_USER%@%SERVER_IP%:%PROJECT_DIR%/

echo Uploading data...
scp -r data %SERVER_USER%@%SERVER_IP%:%PROJECT_DIR%/

echo Uploading deploy script...
scp deploy.sh %SERVER_USER%@%SERVER_IP%:%PROJECT_DIR%/

echo.
echo [3/3] Setting permissions...
ssh %SERVER_USER%@%SERVER_IP% "chmod +x %PROJECT_DIR%/deploy.sh"

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Connect to server:
echo    ssh %SERVER_USER%@%SERVER_IP%
echo.
echo 2. Go to project directory:
echo    cd %PROJECT_DIR%
echo.
echo 3. Run deploy script:
echo    bash deploy.sh
echo.
pause
