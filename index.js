const net = require('net');
const fs = require('fs');
const path = require('path');

// 多端口配置
const SERVERS = [
    { port: 10021, host: '0.0.0.0', name: 'WITS0-Server-1' },
    // { port: 10022, host: '0.0.0.0', name: 'WITS0-Server-2' },
    // { port: 10023, host: '0.0.0.0', name: 'WITS0-Server-3' }
];

// 读取示例数据
const wits0Data = require('./sample_data.js');

let currentIndex = 0; // 新增：跟踪当前索引

// 创建TCP服务器的函数
function createServer(config) {
    const server = net.createServer((socket) => {
        console.log(`[${config.name}] Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

        socket.on('error', (err) => {
            console.log(`[${config.name}] Socket error:`, err);
        });

        socket.on('close', () => {
            console.log(`[${config.name}] Client disconnected`);
        });

        // 定时发送数据
        const sendData = () => {
            if (!socket.destroyed) {
                // 检查索引是否越界
                if (currentIndex >= wits0Data.length) {
                    console.log(`[${config.name}] Index out of bounds, stopping data sending.`);
                    clearInterval(interval); // 停止发送数据
                    return; // 退出函数
                }

                // 按顺序选择数据
                const data = wits0Data[currentIndex];
                
                // 将数据中的逗号替换为\r\n，并在末尾添加\r\n
                const formattedData = data.split(',').join('\r\n');
                
                // 发送数据
                socket.write(formattedData);
                console.log(`[${config.name}] Sent data:`, formattedData);
                
                // 更新索引，循环回到开头
                currentIndex = (currentIndex + 1) % wits0Data.length; // 新增：更新索引
            }
        };

        // 每2秒发送一次数据
        const interval = setInterval(sendData, 2000);

        // 当连接关闭时清除定时器
        socket.on('close', () => {
            clearInterval(interval);
        });
    });

    // 启动服务器
    server.listen(config.port, config.host, () => {
        console.log(`[${config.name}] Mock WITS0 server running at ${config.host}:${config.port}`);
    });

    // 错误处理
    server.on('error', (err) => {
        console.error(`[${config.name}] Server error:`, err);
    });

    return server;
}

// 创建多个服务器实例
SERVERS.forEach(config => {
    createServer(config);
}); 