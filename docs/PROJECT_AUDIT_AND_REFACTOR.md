# 漂流售票系统 · 全面梳理与重构方案

> 本文档完全基于当前两个仓库的源代码（`sales` 后端、`sales-front` 前端）梳理，**不依赖任何旧文档**。
> 编写时间：2026-05-20

---

## 一、当前项目真实情况（基于代码）

### 1.1 仓库结构

| 仓库 | 角色 | 关键文件 |
|---|---|---|
| `/Users/gaopengfei/life/sales` | Node.js 后端 + 静态文件托管 | `app.js`, `routes/admin.js`, `lib/mongo.js`, `pdf/pdfKit.js` |
| `/Users/gaopengfei/life/sales-front` | React (CRA + react-app-rewired) 后台 | `src/admin/Router.jsx`, `src/admin/store/*.js`, `src/admin/Element/*` |

> `sales/app.js:37-38` 已经直接把 `../sales-front/build` 作为静态资源目录托管，说明部署时前端构建产物会被后端 serve。**这是合并到一个仓库（monorepo）的天然契机。**

### 1.2 后端技术栈与现状

- 框架：Express 4 + express-session（内存 session，重启丢失）
- 数据：MongoDB，**同时引入了 `mongodb`、`mongolass`、`mongoose` 三套驱动**（`package.json:32-34`），实际运行时 `routes/admin.js` 仅使用原生 `mongodb` + `mongoose.Types.ObjectId`，`lib/mongo.js` 中的 mongolass User/Post/Comment 模型完全没有被任何路由引用，是死代码。
- 路由总览（`routes/admin.js`，所有都挂在 `/admin` 前缀下）：
  - `GET  /admin/Data` —— 取订单列表，按 `powerId` 过滤（普通用户只看自己）
  - `GET  /admin/price` —— 取价格表
  - `POST /admin/updateoneOrder` —— 更新订单
  - `POST /admin/deleteOne` —— 删除订单
  - `POST /admin/insertoneOrder` —— 新建订单 + 用户单号自增
  - `POST /admin/initPdf` —— 触发 PDFKit 出票
  - `POST /admin/login` / `GET /admin/loginOut` / `GET /admin/checkLogin`
  - `GET  /admin/getSaler` / `GET /admin/userMessage`
  - `GET  /admin/users` / `POST /admin/insertuser` / `POST /admin/updateuser` / `POST /admin/deleteuser`
  - `POST /admin/setprice` / `POST /admin/updatePrice`
  - `GET  /admin/getstore` / `POST /admin/insertStore` / `POST /admin/updateStore` / `POST /admin/deleStore`
- 路由文件 `routes/login.js` 是 `routes/admin.js` 中 login 段的重复拷贝，**未被 app.js 引用**，是死代码。
- `routes/mongo/connect.js` 全部注释掉，是死代码。
- `routes/index.js` 调用 `res.render('index')` 但项目根本未配置 view engine，调用 `/` 会 500——好在静态资源中间件先命中 `index.html`，所以无感。

### 1.3 后端订单数据模型（从 `storeOrder.js:19-34` + `admin.js:61-86` 反推）

集合：`sales.order`
```
{
  _id, orderNum,                  // "YYYY-MM-DD-{saler}-{自增}"
  time,                           // "YYYY-MM-DD"，无时分秒
  platform,                       // 现场/美团/红苹果/驴妈妈/云客赞/其他
  payWay,                         // 票价支付方式
  depositePayWay,                 // 押金支付方式
  adultNum, childNum, accidentNum,
  deposite,                       // 押金金额（拼写错误，应为 deposit）
  totalMoney,
  isReback, ifFinish,             // "true"/"false"，"ing"/"ed"，字符串而非布尔
  saler,                          // 售票员用户名（无外键）
  phoneNumber                     // 注意 admin.js 中 phoneNumber 永远写空字符串，前端 `inputUpdate` 写死 `phoneNumber: ''`（storeOrder.js:311）
}
```

集合：`sales.user`
```
{ _id, username, password(明文), powerId("1"|"2"), orders(自增计数) }
```

集合：`sales.price`、`sales.store`（用品）。

### 1.4 前端技术栈与现状

- React 16.7 + react-router **v3**（混用 v3 的 `hashHistory`/`onEnter` 与 v4 包） + antd 3 + MobX 5（装饰器）+ axios 0.18
- 状态管理 5 个 store（`storeOrder/storeLogin/storePrice/storeSet/storeStore`），均为单例
- `package.json:44` 写死 `proxy: http://120.78.205.46:7003`（生产 IP 进了源代码）
- `storeOrder.getInvoice` 中 `window.open("http://127.0.0.1/pdf/...")`（`storeOrder.js:275`）写死本机域名
- `getword` 方法（`storeOrder.js:403-415`）以 `127.0.0.1` 拼接，无效残留
- 路由层级：`/login` → `/order`（`Order.jsx`）→ 子路由 `Table` / `setting`
- 打印走 Lodop（`public/js/LodopFuncs.js`），由 `Printer.jsx` 渲染隐藏 form，由 `inputUpdate` 中的 `window.myPreview1()` 触发
- 票面时间仅显示 `YYYY年MM月DD日`（`Printer.jsx:28`），**不含时分秒**

### 1.5 已知问题汇总（按严重度）

#### 🔴 安全
1. **密码明文存储 + 字符串相等比较**（`admin.js:106-121`）。
2. **登录全表扫描**：`users.find().toArray()` 后在内存里 `find`，存在 NoSQL 注入面（请求体直接进 mongoose）。
3. **session secret/key 默认值**写在 `config/default.js`，README 也明示 `.env`，部署时若忘记设置，secret 即为公开常量。
4. **CORS 全开**：`Access-Control-Allow-Origin: *` 同时启用 cookie session（`app.js:16-21`），跨站可被滥用（虽然 ACAO=* 时浏览器不会带 cookie，但语义混乱）。
5. **管理员鉴权不足**：除登录中间件 `checkLogin` 外，没有 `powerId === "2"` 的服务端校验，所有删除/改价/管理用户接口仅依赖前端按钮隐藏。
6. **前端硬编码生产 IP**（`package.json:44`、`storeOrder.js:275`）。
7. `_id: mongoose.Types.ObjectId(req.body._id)` 未做异常处理，构造非法 _id 直接抛 500。

#### 🟠 可维护性
8. 三套 Mongo 驱动并存；mongolass 模型完全不用。
9. `routes/login.js`、`routes/mongo/connect.js` 是死代码。
10. `phoneNumber` 在前端写入时被强制设为 `''`（`storeOrder.js:311`）——这就是「手机尾号查询」当前不可用的根因。
11. 字段命名拼写错误：`deposite`、`Searching`、`fiter`、`getUerMessage`、`setFilishFilter`。
12. `boolean` 用字符串 `"true"/"false"` 表示。
13. 订单 `time` 仅日期，丢失下单时刻。
14. 前端 store 在构造函数里就发 axios，未登录路由也会触发 401。
15. react-router v3 + v4 混用（`react-router@3.2.1` 与 `react-router-dom@4.3.1`）——长期升级负担。
16. 没有任何测试、ESLint、TypeScript。
17. README 描述与代码不符，旧 docs（`docs/frontend-backend-alignment.md`、`sales-front/docs/项目梳理.md`）已过期。

---

## 二、目标架构（重构后）

### 2.1 单仓库（Monorepo）方案 ✅ 推荐

利用 pnpm workspace，一仓两包，部署仍可独立或合并：

```
piaoxi/
├─ package.json              # workspace 根
├─ pnpm-workspace.yaml
├─ packages/
│  ├─ server/                # 来自 sales/
│  │  ├─ src/
│  │  │  ├─ app.ts
│  │  │  ├─ config/
│  │  │  ├─ db/              # 单一 mongo 客户端
│  │  │  ├─ models/          # mongoose schemas (Order/User/Price/Store)
│  │  │  ├─ routes/
│  │  │  ├─ services/        # 业务逻辑
│  │  │  ├─ middlewares/     # auth/role/error
│  │  │  └─ utils/
│  │  └─ tsconfig.json
│  └─ web/                   # 来自 sales-front/
│     ├─ src/
│     │  ├─ api/             # 集中 axios 封装
│     │  ├─ pages/           # Login/OrderList/Setting
│     │  ├─ components/
│     │  ├─ stores/          # MobX 或迁 Zustand
│     │  └─ utils/
│     └─ vite.config.ts      # 由 CRA→Vite，构建快 10x
└─ docs/
```

构建：`pnpm -r build`，server 启动时仍 `express.static(packages/web/dist)`，部署形态不变。

> 若不想动太大，第一阶段只做 git submodule 合并：把 `sales-front` 作为 `sales/web` 子目录，复用现有构建脚本，先解决「两个仓库散乱」问题。

### 2.2 后端最小重构清单

1. **删除死代码**：`routes/login.js`、`routes/mongo/connect.js`、`lib/mongo.js` 中未使用的模型；`package.json` 移除 `mongolass`、`pdfkit`（如不再用）、`docx-pdf` 等不用的依赖。
2. **统一 DB**：只保留一个 `mongoose`，集中在 `db/index.ts` 导出 `connect()` 与 `models/*`。
3. **Mongoose Schema**（替代散乱字段）：
   ```ts
   const OrderSchema = new Schema({
     orderNum: { type: String, index: true, unique: true },
     time:     { type: Date, default: Date.now, index: true }, // ⬅ 改为 Date
     platform: String,
     payWay: String,
     depositePayWay: String,
     adultNum: Number, childNum: Number, accidentNum: Number,
     deposit:        { type: Number, default: 100 },           // 改正拼写
     depositRefunded:{ type: Boolean, default: false, index: true }, // 新增
     totalMoney: Number,
     saler: { type: String, index: true },
     phoneNumber: { type: String, index: true },               // 改为真实写入
     phoneTail:   { type: String, index: true },               // 末 4 位冗余索引
     ticketNo:    { type: String, index: true },               // 打印机票号（错票备注用）
     ticketNote:  { type: String, default: '' },               // 错票备注
     printedAt:   { type: Date },                              // 打印时刻（时分秒）
   }, { timestamps: true });
   OrderSchema.pre('save', function() {
     if (this.phoneNumber) this.phoneTail = this.phoneNumber.slice(-4);
   });
   ```
4. **鉴权**：`checkLogin` 增加 `requireAdmin`；所有写接口套 `requireAdmin` 或 owner 判断。
5. **密码哈希**：bcrypt（建库一次性迁移脚本读旧明文写哈希）。
6. **CORS**：删 `*`，仅在 dev 用白名单。
7. **错误处理**：统一 `errorHandler` 中间件，禁止 `throw err`。
8. **配置**：所有敏感项强制读 `process.env`，启动时校验。
9. **日志**：保留 winston 但默认仅 file，不打到 stdout 影响 pm2。

### 2.3 前端最小重构清单

1. **构建**：CRA → Vite + TS，去掉 react-app-rewired、babel 装饰器、`NODE_OPTIONS=--openssl-legacy-provider` 这些历史包袱。
2. **路由**：react-router v3 → v6（`<Routes><Route element={<RequireAuth/>}>...`）。
3. **API 层**：`src/api/index.ts` 集中创建 axios 实例，base URL 走 `import.meta.env.VITE_API_BASE`，删 `package.json` 中硬编码 `proxy`。
4. **State**：保留 MobX（成本最低），但 stores 不在构造里发请求；改为路由 onEnter / `useEffect`。
5. **类型**：定义 `Order`、`User` 等接口，所有 store 字段类型化，杜绝 `"true"/"false"` 字符串布尔。
6. **修复 phoneNumber 写死为空**（`storeOrder.js:311`）。
7. 删除 `getword`、`downloadFile` 等无效残留。

---

## 三、新需求落地方案

### 需求 1：手机尾号查询
- **后端**：`Order.phoneTail` 索引；新增 `GET /api/orders?phoneTail=1234&from=...&to=...`，service 内 `find({ phoneTail })`。
- **前端**：搜索框上方 Tab 切换「订单号 / 手机尾号」，复用 `setInputSearch`，但请求换路由。
- 兼容旧数据：迁移脚本一次性回填 `phoneTail = phoneNumber.slice(-4)`。

### 需求 2：押金是否已退还（同一手机尾号多单只付一次押金）
- 数据：新增 `depositRefunded: Boolean`。
- 业务规则：
  - 创建订单时，若该 `phoneTail` + 同一天已存在 `deposit > 0` 的订单 → 当前订单 `deposit = 0` 并打标 `depositLinkedTo = <existingOrderId>`。
  - 退押金动作：`POST /api/orders/:id/refund-deposit`，会同时把所有 `depositLinkedTo === id` 或同 phoneTail+同天的订单 `depositRefunded = true`。
- UI：列表新增「押金状态」列（已付/已退/关联他单），订单行操作菜单增加「退押金」按钮。

### 需求 3：导出月/日数据
- 后端：`GET /api/orders/export?granularity=day|month&from=YYYY-MM-DD&to=YYYY-MM-DD`，使用 `exceljs` 流式输出 xlsx，含汇总 sheet + 明细 sheet。
- 前端：设置页 / 列表页头加「导出」按钮，调用 `window.location = '/api/orders/export?...'`。

### 需求 4：错票备注（打印机跳号）
- 数据：`Order.ticketNo`（实际打印的票号），`Order.ticketNote`（错票备注），`Order.voided: Boolean`。
- UI：订单行新增「错票」按钮 → 弹窗输入跳号原因和实际票号 → 设置 `voided=true, ticketNote=...`。
- 列表对错票行做红色标记，统计中默认排除 `voided`。

### 需求 5：打印时间精确到秒
- 数据：`Order.printedAt: Date`，下单/补打印时设置 `Date.now()`。
- 票面（`Printer.jsx`）渲染：`moment(printedAt).format('YYYY-MM-DD HH:mm:ss')` 替换原 `time[0]+"年"+...`。
- 同时把 `Order.time` 字段从 `string` 升级为 `Date`，旧数据迁移脚本：`time = new Date(time + 'T00:00:00')`。

---

## 四、推荐实施顺序

1. **第 1 步（合仓 & 死代码清理）**：把两个仓库合并为 monorepo；删除 `routes/login.js`、`routes/mongo/connect.js`、未使用依赖；统一 DB 驱动为 mongoose。
2. **第 2 步（数据模型 + 迁移脚本）**：写 `models/Order.ts`，写一次性迁移脚本回填 `phoneTail`、`time → Date`、`isReback → Boolean`。
3. **第 3 步（鉴权与密码）**：bcrypt 迁移 + `requireAdmin` 中间件 + 删除 CORS `*`。
4. **第 4 步（前端 API 层 + 修复 phoneNumber）**：先修 `storeOrder.js:311` 让手机号能落库，再统一 api 层。
5. **第 5 步（依次实现新需求 1–5）**：每个需求一个 PR，先后端再前端。
6. **第 6 步（构建升级）**：CRA → Vite，react-router v6。该步可与新需求并行做。

---

## 五、风险与注意事项

- 生产库存量未知，迁移脚本必须先在备份库 dry-run。
- Lodop 浏览器插件版本可能锁定老 React/老 webpack 产物的 DOM 结构，升级 Vite 后需回归打印一次。
- 旧 `orderNum` 由 `users.orders++` 维护，并发下会重复——重构时改为基于 mongo `findOneAndUpdate({$inc})`原子自增，避免「同一秒两单同号」。
- 押金联动逻辑需要明确「同一天」的边界（自然日 vs 24h 滑窗），建议产品确认后再实现。

---

附：本文档涉及的关键代码位置可直接跳转：
- 后端订单接口：`sales/routes/admin.js:23`、`:61`、`:87`
- 登录与鉴权：`sales/routes/admin.js:106`、`sales/routes/check.js:1`
- 前端订单 store：`sales-front/src/admin/store/storeOrder.js:10`
- phoneNumber bug：`sales-front/src/admin/store/storeOrder.js:311`
- 票面打印：`sales-front/src/admin/Element/printer/Printer.jsx:28`
