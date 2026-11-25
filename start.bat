@echo off
cd /d "%~dp0"
echo =======================================================
echo    Starting Operations Manager & PA + Excel Auto-Sync
echo =======================================================
echo App URL: http://localhost:8080
echo Excel File: operations_log.xlsx
echo.
python server.py
pause
