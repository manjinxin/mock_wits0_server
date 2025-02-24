# Mock WITS0 Server

这是一个模拟WITS0数据发送的TCP服务器。它会在多个指定端口上监听连接，并定期向连接的客户端发送WITS0格式的数据。

## 配置

服务器同时在以下端口运行：

- Server-1: 127.0.0.1:10021
- Server-2: 127.0.0.1:10022
- Server-3: 127.0.0.1:10023

## 功能

- 创建多个TCP服务器实例，每个实例监听不同端口
- 每2秒随机发送一条WITS0格式的数据
- 支持多客户端连接
- 自动处理连接断开和错误情况
- 每个服务器独立运行，互不影响

## 本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
node index.js
```

## Docker部署

### 方式一：使用 docker-compose（推荐）

1. 构建并启动服务：
```bash
docker-compose up -d
```

2. 查看日志：
```bash
docker-compose logs -f
```

3. 停止服务：
```bash
docker-compose down
```

### 方式二：使用 Docker 命令

1. 构建镜像：
```bash
docker build -t mock-wits0-server .
```

2. 运行容器：
```bash
docker run -d \
  --name mock-wits0-server \
  -p 10021:10021 \
  -p 10022:10022 \
  -p 10023:10023 \
  mock-wits0-server
```

3. 查看日志：
```bash
docker logs -f mock-wits0-server
```

4. 停止并删除容器：
```bash
docker stop mock-wits0-server
docker rm mock-wits0-server
```

## 测试连接

可以使用 nc (netcat) 命令测试任意端口：

```bash
# 测试端口 10021
nc 127.0.0.1 10021

# 测试端口 10022
nc 127.0.0.1 10022

# 测试端口 10023
nc 127.0.0.1 10023
```

## 数据格式

数据格式遵循WITS0标准，每条数据以 '&&' 开头，以 '!!' 结尾。数据字段之间用逗号分隔。 