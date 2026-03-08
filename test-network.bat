@echo off
echo ========================================
echo    网络测试脚本
echo ========================================
echo.

echo [1] 检查3000端口监听状态...
netstat -ano | findstr :3000
echo.

echo [2] 检查本机IP地址...
ipconfig | findstr "IPv4"
echo.

echo [3] 测试本地访问...
curl -s http://localhost:3000/api/health
echo.
echo.

echo [4] 测试IP访问（需要你替换成你的IP）...
curl -s http://192.168.92.1:3000/api/health
echo.
echo.

echo ========================================
echo    测试完成
echo ========================================
echo.
echo 如果所有测试都返回JSON数据，说明服务正常。
echo 如果IP访问失败，可能是防火墙问题。
echo.
pause
