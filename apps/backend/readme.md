
项目调试运行 npm run start

项目启动运行 node app.js

项目启动后必须先添加超级管理员，暂时只能手动在 MongoDB 控制台添加。请将 `<YOUR_STRONG_PASSWORD>` 替换为强密码，勿使用示例中的占位符作为真实密码。

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

## 查询磁盘使用量
find / -size +100M -exec ls -lh {} \;

## 查询历史使用命令
history

## 本地调试

通过环境变量 `MONGODB_URI` 连接远程或本地数据库，勿将连接串写入 `config/default.js` 并提交到仓库。

## 安装数据库
参考
https://juejin.cn/post/7176963017127493689?searchId=20250123180240C237B6367C8C3B4EB2AB
