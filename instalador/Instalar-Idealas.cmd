@echo off
rem Lanzador de doble clic del instalador del motor de Idealas (Windows).
rem Sólo busca Node y corre instalar.mjs, que vive en esta misma carpeta.
chcp 65001 >nul
title Idealas - Motor de creación
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Falta Node.js 24. Instálalo con:
  echo.
  echo       winget install --id OpenJS.NodeJS.LTS -e
  echo.
  echo   y vuelve a abrir este instalador.
  echo.
  pause
  exit /b 1
)
node "%~dp0instalar.mjs" %*
echo.
pause
