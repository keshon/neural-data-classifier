@echo off

REM Check if ts-node is available locally
if not exist .\node_modules\.bin\ts-node (
    echo ts-node is not installed. Please run 'npm install -D ts-node' to install it locally.
    exit /b 1
)

.\node_modules\.bin\ts-node src\__main__.ts %*