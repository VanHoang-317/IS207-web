@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM FLUER - Setup database & promote admin (one-click)
REM ============================================================

set "PGPASSWORD=vanhoang3107"
set "PGHOST=localhost"
set "PGPORT=5432"
set "PGUSER=postgres"
set "PGDB=fluer"
set "SCHEMA_FILE=%~dp0backend\src\models\schema.sql"

REM ====== Hỏi email cần promote ======
set /p USER_EMAIL="Nhap email tai khoan can promote admin: "

if "%USER_EMAIL%"=="" (
  echo [LOI] Ban chua nhap email. Thoat.
  pause
  exit /b 1
)

REM ====== Tim psql.exe ======
where psql >nul 2>nul
if errorlevel 1 (
  echo [CANH BAO] Khong tim thay psql trong PATH.
  echo Thu duong dan mac dinh cua PostgreSQL 16/15/14...
  for %%V in (17 16 15 14 13) do (
    if exist "C:\Program Files\PostgreSQL\%%V\bin\psql.exe" (
      set "PSQL=C:\Program Files\PostgreSQL\%%V\bin\psql.exe"
      goto :found
    )
  )
  echo [LOI] Khong tim thay psql.exe. Hay cai PostgreSQL hoac them vao PATH.
  pause
  exit /b 1
) else (
  set "PSQL=psql"
)
:found

echo.
echo === Buoc 1: Tao bang tu schema.sql ===
"%PSQL%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDB% -f "%SCHEMA_FILE%"
if errorlevel 1 (
  echo [LOI] Khong chay duoc schema.sql. Kiem tra PostgreSQL co dang chay khong.
  pause
  exit /b 1
)

echo.
echo === Buoc 2: Promote %USER_EMAIL% len admin ===
"%PSQL%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDB% -c "UPDATE users SET role = 'admin' WHERE email = '%USER_EMAIL%';"

echo.
echo === Buoc 3: Verify ===
"%PSQL%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDB% -c "SELECT email, role FROM users WHERE email = '%USER_EMAIL%';"

echo.
echo ============================================================
echo HOAN TAT. Bay gio hay:
echo   1. Vao website Logout
echo   2. Login lai bang email: %USER_EMAIL%
echo   3. Truy cap http://localhost:3000/admin
echo ============================================================
pause
endlocal
