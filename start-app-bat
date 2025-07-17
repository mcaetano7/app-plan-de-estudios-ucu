@echo off
REM Verificar si node esta instalado
node -v >nul 2>&1
IF ERRORLEVEL 1 (
    echo.
    echo ERROR: Node.js no esta instalado.
    echo instalalo desde https://nodejs.org y volve a ejecutar esto 
    pause
    exit /b 1
)

REM Node.js esta instalado, continuar con la instalacion
echo Node.js detectado. Instalando dependencias...
npm install

echo Iniciando la aplicacion...
npm run dev

pause
