# Docker 常用知识与命令速查

## 一、基本概念

| 概念 | 说明 |
|------|------|
| 镜像 (Image) | 模板，只读，类似 ISO |
| 容器 (Container) | 镜像的运行实例，类似进程 |
| 仓库 (Registry) | 存放镜像的地方，如 Docker Hub |
| 卷 (Volume) | 容器持久化数据的存储区 |
| 网络 (Network) | 容器间通信的虚拟网络 |

---

## 二、Docker 容器生命周期

```
run → start → stop → restart → rm
```

| 操作 | 命令 |
|------|------|
| 创建并启动 | `docker run -d --name my-app my-image` |
| 后台运行 | `docker run -d -p 8080:8080 my-app` |
| 启动已停止的容器 | `docker start my-app` |
| 停止容器 | `docker stop my-app` |
| 重启容器 | `docker restart my-app` |
| 删除容器（需先停） | `docker rm my-app` |
| 强制删除运行中容器 | `docker rm -f my-app` |
| 查看运行中容器 | `docker ps` |
| 查看所有容器（含停止） | `docker ps -a` |

---

## 三、日志与调试

| 操作 | 命令 |
|------|------|
| 查看实时日志 | `docker logs -f my-app` |
| 查看最近 100 行日志 | `docker logs --tail 100 my-app` |
| 查看日志并跟踪 | `docker logs -f --tail 100 my-app` |
| 查看日志时间戳 | `docker logs -f -t my-app` |
| 查看容器最近一次退出原因 | `docker ps -l` |

**进入容器内部**
```bash
# 进入容器 bash（MySQL / PostgreSQL / Nginx / Alpine 等）
docker exec -it <容器名> /bin/bash

# Alpine 基础镜像用 sh
docker exec -it <容器名> /bin/sh

# MongoDB
docker exec -it <容器名> mongosh

# MySQL
docker exec -it <容器名> mysql -u root -p

# PostgreSQL
docker exec -it <容器名> psql -U postgres -d mydb

# 单次命令执行（不进交互）
docker exec <容器名> <命令>
docker exec <容器名> ls /app
```

**查看容器信息**
```bash
docker inspect my-app          # 完整配置 JSON
docker inspect --format '{{.NetworkSettings.IPAddress}}' my-app   # 只取 IP
docker port my-app             # 端口映射
docker stats my-app            # 实时资源使用（CPU/内存）
```

---

## 四、镜像操作

| 操作 | 命令 |
|------|------|
| 列出本地镜像 | `docker images` |
| 拉取镜像 | `docker pull nginx:alpine` |
| 删除镜像 | `docker rmi nginx:alpine` |
| 构建镜像 | `docker build -t my-app:1.0 .` |
| 推送镜像 | `docker push my-app:1.0` |
| 清理无用镜像 | `docker image prune -a` |

---

## 五、数据管理（Volume）

| 操作 | 命令 |
|------|------|
| 查看卷列表 | `docker volume ls` |
| 查看卷详情 | `docker volume inspect my-volume` |
| 创建卷 | `docker volume create my-volume` |
| 删除未用卷 | `docker volume prune` |
| 删除指定卷 | `docker volume rm my-volume` |

**数据备份**（把容器数据目录复制出来）
```bash
docker cp <容器名>:/var/lib/mysql/data /tmp/backup
```

---

## 六、网络

| 操作 | 命令 |
|------|------|
| 查看网络列表 | `docker network ls` |
| 查看网络详情 | `docker network inspect my-network` |
| 创建网络 | `docker network create --driver bridge my-net` |

---

## 七、Docker Compose（`docker compose`）

> 项目中用 `docker-compose.yml` 定义了 `app`、`mongo`、`nginx` 三个服务。

| 操作 | 命令 |
|------|------|
| 启动所有服务 | `docker compose up -d` |
| 停止所有服务 | `docker compose down` |
| 停止并删除卷（清数据） | `docker compose down -v` |
| 查看服务状态 | `docker compose ps` |
| 查看实时日志（所有服务） | `docker compose logs -f` |
| 查看特定服务日志 | `docker compose logs -f app` |
| 重启某个服务 | `docker compose restart app` |
| 重启所有服务 | `docker compose restart` |
| 进入服务容器 | `docker compose exec app /bin/bash` |
| 单次命令 | `docker compose exec app <命令>` |
| 构建并启动 | `docker compose up -d --build` |
| 强制重建 | `docker compose up -d --force-recreate` |
| 暂停/恢复服务 | `docker compose pause` / `docker compose unpause` |

---

## 八、本项目（sales）常用命令速查

```bash
# 查看所有容器状态
docker compose ps

# 启动
docker compose up -d

# 查看 app 日志
docker compose logs -f app

# 查看 mongo 日志
docker compose logs -f mongo

# 重启 app
docker compose restart app

# 进入 mongo 查询数据
docker exec -it sales-mongo-1 mongosh
# 进入后
use sales
show collections
db.orders.find().limit(20).pretty()

# 强制重建并启动
docker compose up -d --force-recreate --build

# 清数据重启（慎用，会删除数据库）
docker compose down -v && docker compose up -d

# 查看资源使用
docker compose stats

# 查看 app 容器 IP
docker inspect --format '{{.NetworkSettings.IPAddress}}' sales-app-1

# 查看 mongo 容器 IP
docker inspect --format '{{.NetworkSettings.IPAddress}}' sales-mongo-1
```

---

## 九、常用参数速查

| 参数 | 含义 |
|------|------|
| `-d` | 后台运行 (detached) |
| `-p 8080:8080` | 端口映射 宿主机:容器 |
| `-v /host/path:/container/path` | 目录挂载 |
| `-e KEY=VALUE` | 设置环境变量 |
| `--name my-app` | 给容器命名 |
| `--rm` | 容器退出后自动删除 |
| `-it` | 交互式 + 分配终端 |
| `-f docker-compose.yml` | 指定配置文件 |
| `--env-file .env` | 指定环境变量文件 |

---

## 十、常见问题排查

| 症状 | 排查命令 |
|------|------|
| 容器起不来 | `docker compose logs app` |
| 容器不断重启 | `docker compose logs --tail=50 app` + `docker inspect app` |
| 端口被占用 | `lsof -i :3100` 或 `netstat -tlnp \| grep 3100` |
| 容器内网络不通 | `docker exec -it app curl http://mongo:27017` |
| 硬盘占满 | `docker system df` → `docker system prune -a` |
| MySQL 连接拒绝 | 检查 `docker compose.yml` 中 MYSQL_ROOT_PASSWORD 是否正确 |
| Mongo 连接不上 | 检查 MONGO_URI 环境变量和端口映射 |
| 容器内时间不对 | `docker exec app date` → 挂载 `/etc/localtime` 或 `-e TZ=Asia/Shanghai` |