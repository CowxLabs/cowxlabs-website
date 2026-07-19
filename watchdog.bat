@echo off
set BE_DIR=C:\Users\fakef\OneDrive\Desktop\WeThePeople\Cowx Labs Software Solutions\Cowx Labs Site\backend
set FE_DIR=C:\Users\fakef\OneDrive\Desktop\WeThePeople\Cowx Labs Software Solutions\Cowx Labs Site\frontend

:loop
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri http://localhost:4000/api/health -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop | Out-Null } catch { Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*server.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev' -WorkingDirectory '%BE_DIR%' -WindowStyle Hidden }"
powershell -NoProfile -Command "try { Invoke-WebRequest -Uri http://localhost:5173 -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop | Out-Null } catch { Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*vite*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','npm run dev' -WorkingDirectory '%FE_DIR%' -WindowStyle Hidden }"
timeout /t 8 /nobreak >nul
goto loop
