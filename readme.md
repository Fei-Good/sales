
# 漂流售票系统（Monorepo）

## 安装依赖

```bash
npm install
```

## 本地开发

```bash
# 前后端同时启动
npm run dev

# 仅启动前端（Vite）
npm run dev:front

# 仅启动后端（NestJS）
npm run dev:nest
```

## 构建与检查

```bash
npm run build
npm run lint
```

## 初始化数据库（首次）

项目启动后需先添加超级管理员（当前通过 MongoDB 控制台手动添加）。
请将 `<YOUR_STRONG_PASSWORD>` 替换为强密码。

```js
db.createCollection('order')
db.createCollection('user')
db.createCollection('price')
db.createCollection('store')

db.user.insert({
  orders: 0,
  password: "<YOUR_STRONG_PASSWORD>",
  powerId: "2",
  username: "supermanage"
})

db.price.insert({ adultPrice: 80, childPrice: 40, plupPrice: 50, clothPrice: 30 })
```

## 环境变量

复制 `.env.example` 为 `.env` 并配置（`.env` 勿提交到 git）：

- `MONGODB_URI`：MongoDB 连接串（本地默认 `mongodb://127.0.0.1:27017/sales`）
- `SESSION_SECRET`：Session 签名密钥（生产环境必须设置）

## 说明

通过环境变量 `MONGODB_URI` 连接远程或本地数据库，不要将连接串写入代码并提交到仓库。
