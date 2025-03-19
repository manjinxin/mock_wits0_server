const net = require('net');
const fs = require('fs');
const path = require('path');

// 多端口配置
const SERVERS = [
    { port: 10021, host: '0.0.0.0', name: 'WITS0-Server-1' },
    { port: 10022, host: '0.0.0.0', name: 'WITS0-Server-2' },
    { port: 10023, host: '0.0.0.0', name: 'WITS0-Server-3' }
];

// 数据生成函数
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  
    return {
      datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
      date: `${year}${month}${day}`,
      time: `${hours}${minutes}${seconds}`,
    };
}

function formatValue(value, prefix) {
    const numStr = Math.abs(value).toFixed(2);
    const sign = value < 0 ? "-" : "";
    return `${prefix}${sign}${numStr}`;
}

function generateWitsLine(baseTime, index) {
    const time = new Date(baseTime.getTime() + index * 5000);
    const { datetime, date, time: timeStr } = formatDateTime(time);
  
    const randomFloat = (base, variance = 0.1) =>
      base + (Math.random() - 0.5) * variance;
  
    const incrementalValue = (base, increment) => base + index * increment;
  
    return (
      `"&&,0101ZZ-A2,0104${datetime},0105${date},0106${timeStr},010739,` +
      `${formatValue(randomFloat(6707.1, 0.2), "0108")},` +
      `${formatValue(randomFloat(3729.12, 0.1), "0109")},` +
      `${formatValue(randomFloat(6708.15, 0.05), "0110")},` +
      `${formatValue(randomFloat(3729.53, 0.05), "0111")},` +
      `${formatValue(randomFloat(8.1, 0.2), "0112")},` +
      `01130,` +
      `${formatValue(randomFloat(134.68, 0.5), "0114")},` +
      `${formatValue(randomFloat(0.31, 0.1), "0116")},` +
      `${formatValue(randomFloat(0.31, 0.1), "0117")},` +
      `${formatValue(randomFloat(49.54, 0.5), "0118")},` +
      `01190,0120120,` +
      `${formatValue(incrementalValue(26242.33, 0.5), "0121")},` +
      `01230,` +
      `${formatValue(randomFloat(52, 1), "0124")},` +
      `${formatValue(randomFloat(57, 0.5), "0125")},` +
      `${formatValue(randomFloat(164.61, 0.1), "0126")},` +
      `${formatValue(randomFloat(-20.36, 0.1), "0127")},` +
      `012845,` +
      `${formatValue(incrementalValue(1709.99, 0.05), "0130")},` +
      `01311300,01321300,013353,013450,` +
      `${formatValue(randomFloat(5145.11, 50), "0135")},` +
      `${formatValue(randomFloat(4750, 50), "0136")},` +
      `${formatValue(incrementalValue(86589, 1), "0137")},` +
      `${formatValue(randomFloat(10113, 1), "0138")},` +
      `${formatValue(randomFloat(6706.36, 0.1), "0139")},` +
      `${formatValue(randomFloat(3.49, 0.1), "0140")},` +
      `${formatValue(randomFloat(82115.99, 0.1), "0141")},` +
      `${formatValue(randomFloat(5507.46, 10), "0142")},` +
      `0143196.3,01440,!!"`
    );
}

// 创建TCP服务器的函数
function createServer(config) {
    const server = net.createServer((socket) => {
        console.log(`[${config.name}] Client connected from ${socket.remoteAddress}:${socket.remotePort}`);
        let dataIndex = 0;
        const startTime = new Date(); // 记录开始时间

        socket.on('error', (err) => {
            console.log(`[${config.name}] Socket error:`, err);
        });

        socket.on('close', () => {
            console.log(`[${config.name}] Client disconnected`);
        });

        // 定时发送数据
        const sendData = () => {
            if (!socket.destroyed) {
                // 生成实时数据
                const data = generateWitsLine(startTime, dataIndex);
                
                // 将数据中的逗号替换为\r\n，并在末尾添加\r\n
                const formattedData = data.split(',').join('\r\n');
                
                // 发送数据
                socket.write(formattedData);
                console.log(`[${config.name}] Sent data index ${dataIndex}`);
                
                // 更新索引
                dataIndex++;
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