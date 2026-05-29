# 青城两河漂流 - 前后端联调对齐文档

> 生成日期：2026-05-20  
> 后端路径：`/Users/gaopengfei/life/sales`  
> 前端路径：`../sales-front`（构建产物在 `../sales-front/build`）

---

## 一、技术栈对照

| 层 | 前端 | 后端 |
|---|---|---|
| 语言 | React 16.7 + MobX 5 | Node.js + Express 4 |
| 组件库 | Ant Design 3.x | - |
| 路由 | react-router v3（hashHistory） | Express Router |
| HTTP | axios（代理转发） | express + body-parser |
| 数据库 | - | MongoDB 4（原生驱动） |
| 认证 | session cookie | express-session |
| 构建 | react-app-rewired | - |

---

## 二、API 接口对照表

### 认证

| 前端调用 | 后端路由 | 方法 | 状态 |
|---|---|---|---|
| `storeLogin.js` POST login | `/login` | POST | ✅ 对齐 |
| `storeLogin.js` GET loginOut | `/loginOut` | GET | ✅ 对齐 |
| `storeLogin.js` GET checkLogin | `/checkLogin` | GET | ✅ 对齐 |
| `storeLogin.js` GET userMessage | `/userMessage` | GET | ✅ 对齐 |
| `storeLogin.js` GET getSaler | `/getSaler` | GET | ✅ 对齐 |

### 订单

| 前端调用 | 后端路由 | 方法 | 状态 |
|---|---|---|---|
| `storeOrder.js` GET Data | `/Data` | GET | ✅ 对齐 |
| `storeOrder.js` POST insertoneOrder | `/insertoneOrder` | POST | ⚠️ 见 Bug#1 |
| `storeOrder.js` POST updateoneOrder | `/updateoneOrder` | POST | ✅ 对齐 |
| `storeOrder.js` POST deleteOne | `/deleteOne` | POST | ✅ 对齐 |
| `storeOrder.js` POST initPdf | `/initPdf` | POST | ⚠️ 见 Bug#2 |

### 价格 / 用户 / 库存

| 前端调用 | 后端路由 | 方法 | 状态 |
|---|---|---|---|
| `storePrice.js` GET price | `/price` | GET | ✅ 对齐 |
| `storeSet.js` users | `/users`, `/insertuser`, `/updateuser`, `/deleteuser` | - | ✅ 对齐 |
| `storeStore.js` store | `/getstore`, `/insertStore`, `/updateStore`, `/deleStore` | - | ✅ 对齐 |

### 新需求 API（待实现）

| 新接口 | 方法 | 参数 | 用途 |
|---|---|---|---|
| `/queryByPhone` | GET | `?tail=XXXX` | 手机尾号查询 |
| `/deposit` | GET | `?phoneTail=XXXX` | 查询押金退还状态 |
| `/insertDeposit` | POST | `{ phoneTail, note? }` | 新建押金记录 |
| `/updateDeposit` | POST | `{ _id, refunded, note? }` | 更新退还状态 |
| `/exportData` | GET | `?year=&month=[&day=]` | 导出月/日 CSV |
| `/errorTickets` | GET | - | 获取所有错票记录 |
| `/insertErrorTicket` | POST | `{ orderNum, note }` | 新建错票备注 |
| `/deleteErrorTicket` | POST | `{ _id }` | 删除错票备注 |

---

## 三、数据字段对照（订单）

前端 `InputBox` 字段 ↔ 后端 `order` collection：

| 前端字段 | 后端字段 | 类型 | 对齐状态 |
|---|---|---|---|
| `_id` | `_id` | string/ObjectId | ✅ |
| `time` | `time` | string | ⚠️ 前端仅 `YYYY-MM-DD`，需改为含时分秒 |
| `orderNum` | `orderNum` | string | ✅ 后端自动生成 |
| `platform` | `platform` | string | ✅ |
| `payWay` | `payWay` | string | ✅ |
| `depositePayWay` | `depositePayWay` | string | ✅ |
| `adultNum` | `adultNum` | number | ✅ |
| `childNum` | `childNum` | number | ✅ |
| `accidentNum` | `accidentNum` | number | ✅ |
| `deposite` | `deposite` | number | ✅ |
| `totalMoney` | `totalMoney` | number | ✅ |
| `isReback` | `isReback` | string `"true"/"false"` | ⚠️ 建议统一为 boolean |
| `ifFinish` | `ifFinish` | string `"ing"/"ed"` | ✅ |
| `saler` | `saler` | string | ✅ 后端从 session 注入 |
| `phoneNumber` | `phoneNumber` | string | ❌ Bug#1：前端硬编码 `''` |
| `errorNote`（新增） | `errorNote`（新增） | string | 🆕 待双端实现 |

---

## 四、已知联调 Bug（必须修复）

### ❌ Bug#1 — phoneNumber 未传后端（P0 阻塞）

- **位置**：`storeOrder.js:311`
- **现象**：`phoneNumber: ''` 硬编码空字符串，手机号永远不写入数据库
- **影响**：手机尾号查询、押金分组逻辑全部失效
- **前端修复**：将 `phoneNumber: ''` 改为 `phoneNumber: this.inputBox.phoneNumber`

### ❌ Bug#2 — PDF/打印地址硬编码（P1）

- **位置**：`storeOrder.js:275`、`storeOrder.js:408`
- **现象**：PDF 下载和 getword 均硬编码 `127.0.0.1:{port}`
- **影响**：部署到生产环境后打印功能失效
- **修复**：改为相对路径，或通过 `process.env.REACT_APP_API_BASE` 注入

### ⚠️ Bug#3 — 路由混用（P2）

- **位置**：`Router.jsx:6`
- **现象**：同时 import react-router v3 和 v4
- **修复**：统一使用 v3，移除 v4 import

### ⚠️ Bug#4 — judgeDay 日期比较逻辑错误（P2）

- **位置**：`method.js:4`
- **修复**：改用 `new Date(a) <= new Date(b)` 或 moment 比较

### ⚠️ Bug#5 — 后端密码明文 + 接口无鉴权（P0）

- **位置**：`routes/admin.js` login / insertuser / GET /users
- **现象**：密码明文存储；`GET /users` 无鉴权且返回密码字段
- **修复**：安装 `bcrypt`，注册时 hash，登录时 compare；projection 排除 `password`

---

## 五、新需求前后端分工

### 需求1：手机尾号查询

| 端 | 改动 |
|---|---|
| 前端 | `storeOrder.js` 新增 `filterPhoneTail` observable；`fiter` computed 加 `endsWith` 过滤；`Table.jsx` 增加输入框 |
| 后端 | 新增 `GET /queryByPhone?tail=XXXX` |
| 前置条件 | 先修复 Bug#1（phoneNumber） |

### 需求2：押金退还状态

| 端 | 改动 |
|---|---|
| 前端 | `storeOrder.js` 新增 `depositGroupMap` computed（按尾号分组）；`Table.jsx` 增加押金状态列 |
| 后端 | 新增 `deposit` collection + `/deposit`、`/insertDeposit`、`/updateDeposit` 接口 |
| 说明 | 以手机尾号为 key，同尾号多订单共享一条押金记录，避免数据不一致 |

### 需求3：导出月/日数据

| 端 | 改动 |
|---|---|
| 前端 | 安装 `xlsx`；`storeOrder.js` 新增 `exportData()` 方法；`Table.jsx` 增加导出按钮 |
| 后端 | 新增 `GET /exportData?year=&month=[&day=]`，返回 CSV；兼容旧数据按 `time` 前缀匹配 |

### 需求4：错票备注

| 端 | 改动 |
|---|---|
| 前端 | `InputBox` 新增 `errorNote` 字段；`AddOrderModal.jsx` 增加备注输入；`Table.jsx` 增加备注列 |
| 后端 | 新增 `errorTicket` collection + `/errorTickets`、`/insertErrorTicket`、`/deleteErrorTicket` |

### 需求5：打印时间精确到分秒

| 端 | 改动 |
|---|---|
| 前端 | `storeOrder.js initInput` 中 `time` 改为 `moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")`；`Printer.jsx` 展示完整时间 |
| 后端 | `insertoneOrder` 中 `time` 同步含时分秒；`pdfKit.js` 渲染区域确认可容纳（必要时缩小字号） |

---

## 六、安全改造要点

| 问题 | 现状 | 改造方案 |
|---|---|---|
| 密码明文 | 存储+比较均明文 | 后端安装 `bcrypt`，注册时 hash，登录时 compare |
| 用户接口泄密 | `GET /users` 无鉴权且返回密码 | 加 `checkLogin` 中间件；projection 排除 `password` |
| getSaler 返回密码 | 返回完整用户文档 | projection 排除 `password` |
| 进程崩溃 | `throw err` 在 callback 中 | 改为 async/await + try/catch，返回 500 |
| 双路径挂载 | `/` 和 `/admin` 均挂同一 router | `app.js` 删除 `app.use('/admin', admin)` |
| CORS 通配符 | `Access-Control-Allow-Origin: *` | 生产环境限定为前端域名 |

---

## 七、开发优先级（前后端对齐版）

| 优先级 | 任务 | 前端 | 后端 |
|---|---|---|---|
| P0 | 修复 phoneNumber 未传 | `storeOrder.js:311` | - |
| P0 | 密码安全 + 接口鉴权 | - | bcrypt + projection |
| P1 | 需求5：时间含分秒 | `storeOrder.js` + `Printer.jsx` | `insertoneOrder` + `pdfKit.js` |
| P2 | 修复硬编码 IP | `storeOrder.js:275,408` | - |
| P2 | 修复路由混用 | `Router.jsx:6` | - |
| P3 | 需求1：手机尾号查询 | `storeOrder.js` + `Table.jsx` | `GET /queryByPhone` |
| P4 | 需求4：错票备注 | `InputBox` + `AddOrderModal` + `Table` | `errorTicket` collection + 3个接口 |
| P5 | 需求2：押金分组逻辑 | `depositGroupMap` computed | `deposit` collection + 3个接口 |
| P6 | 需求3：导出功能 | xlsx + exportData | `GET /exportData` |
| P7 | 后端 async/await 重构 | - | `admin.js` 全量改写 |
| P8 | 清理死代码 | 移除 router v4 import | 删除 `login.js` / `mongo/` / `lib/` |

---

## 八、本地联调配置

前端代理配置（`sales-front/package.json`）：

```json
"proxy": "http://localhost:3001"
```

后端启动：

```bash
cd /Users/gaopengfei/life/sales
npm install
node app.js
```

前端启动：

```bash
cd /Users/gaopengfei/life/sales-front
npm start
```
