@echo off
setlocal enabledelayedexpansion

echo ==============================
echo ATUALIZADOR EXTENSAO CHROME
echo ==============================
echo.

set PASTA=C:\extensions_feegow_chrome\public
set MANIFEST=%PASTA%\manifest.json
set CONTENT=%PASTA%\content.js

set URL_MANIFEST=https://raw.githubusercontent.com/ictbraseg/feegow-extension-chrome-update/plugin_chrome/manifest.json
set URL_CONTENT=https://raw.githubusercontent.com/ictbraseg/feegow-extension-chrome-update/plugin_chrome/content.js

echo 1 - Verificando pasta...

if not exist "%PASTA%" (
    echo Pasta nao existe. Criando...
    mkdir "%PASTA%"
)

echo OK
echo.

echo 2 - Verificando arquivos...

if not exist "%MANIFEST%" (
    echo Manifest nao existe
    goto DOWNLOAD
)

if not exist "%CONTENT%" (
    echo content.js nao existe
    goto DOWNLOAD
)

echo Arquivos encontrados
echo.

echo 3 - Comparando versoes...

for /f %%i in ('powershell -NoProfile -Command "(Get-Content '%MANIFEST%' -Raw | ConvertFrom-Json).version"') do set LOCAL=%%i
for /f %%i in ('powershell -NoProfile -Command "(Invoke-WebRequest '%URL_MANIFEST%' -UseBasicParsing | ConvertFrom-Json).version"') do set REMOTE=%%i

echo Versao local  : %LOCAL%
echo Versao remota : %REMOTE%
echo.

if "%LOCAL%"=="%REMOTE%" (
    echo Extensao ja esta atualizada
    goto SUCESSO
)

echo Nova versao encontrada
echo.

:DOWNLOAD

echo Baixando manifest.json...

powershell -NoProfile -Command "Invoke-WebRequest '%URL_MANIFEST%' -OutFile '%MANIFEST%'"

if errorlevel 1 (
    echo ERRO AO BAIXAR MANIFEST
    pause
    exit
)

echo Baixando content.js...

powershell -NoProfile -Command "Invoke-WebRequest '%URL_CONTENT%' -OutFile '%CONTENT%'"

if errorlevel 1 (
    echo ERRO AO BAIXAR CONTENT.JS
    pause
    exit
)

echo Atualizacao concluida

:SUCESSO

echo.
echo ==============================
echo SUCESSO
echo ==============================

timeout /t 1 >nul
exit