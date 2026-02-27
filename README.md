# 小青蛙大冒险 - Phaser 3 版本

一款使用 Phaser 3 开发的益智解谜游戏，支持发布到微信、抖音、支付宝小游戏平台。

## 快速开始

### 安装依赖

```bash
cd /home/data/aiprj/game2
npm install
```

### 启动开发服务器

```bash
npm run dev
```

游戏将在 http://localhost:3000 自动打开。

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录。

## 项目结构

```
game2/
├── src/
│   ├── main.ts              # 入口文件
│   ├── scenes/              # 游戏场景
│   │   ├── BootScene.ts         # 启动场景（加载资源）
│   │   ├── MainMenuScene.ts     # 主菜单
│   │   ├── LevelSelectScene.ts  # 关卡选择
│   │   └── GameScene.ts         # 游戏主场景
│   └── objects/             # 游戏对象
│       ├── Player.ts            # 玩家
│       ├── Platform.ts          # 平台
│       ├── PushBlock.ts         # 可推箱子
│       ├── Door.ts              # 门（终点）
│       ├── Button.ts            # 按钮
│       ├── Enemy.ts             # 敌人
│       └── TriggerZone.ts       # 触发区域
├── public/
│   └── assets/
│       └── data/               # 关卡数据
│           ├── level1.json
│           ├── level2.json
│           ├── ...
│           └── level10.json
├── index.html                  # HTML 入口
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目配置
```

## 游戏控制

### 键盘控制
- **A / 左箭头**: 向左移动
- **D / 右箭头**: 向右移动
- **W / 上箭头 / 空格**: 跳跃
- **空格（空中）**: 二段跳

### 触摸控制
- 移动端支持触摸操作（待实现）

## 游戏机制

### 核心机制
1. **跳跃与二段跳** - 玩家可以跳跃，空中再次跳跃
2. **推箱子** - 推动箱子填坑或作为垫脚石
3. **移动平台** - 会自动移动的平台
4. **按钮与门** - 踩下按钮可以控制门

### 高级机制
5. **敌人** - 巡逻移动的敌人，踩头顶可消灭
6. **触发区域** - 死亡区域、检查点等

## 关卡设计

当前已有 10 个测试关卡：

| 关卡 | 名称 | 机制 |
|------|------|------|
| 1 | 初出茅庐 | 基础跳跃 |
| 2 | 步步高升 | 移动平台 |
| 3 | 推推乐 | 推箱子 |
| 4 | 机关重重 | 按钮+门 |
| 5 | 小心敌人 | 敌人巡逻 |
| 10 | 终极挑战 | 综合机制 |

## 开发说明

### 添加新关卡

在 `public/assets/data/` 创建新的 JSON 文件：

```json
{
  "levelId": 6,
  "name": "关卡名称",
  "gravity": 980,
  "player": {
    "startPosition": [100, 400],
    "jumpForce": -400,
    "moveSpeed": 150,
    "doubleJumpEnabled": true
  },
  "platforms": [...],
  "blocks": [...],
  "triggers": [...],
  "buttons": [...],
  "door": {...},
  "enemies": [...]
}
```

### 创建新游戏对象

1. 在 `src/objects/` 创建新类
2. 继承 Phaser 的游戏对象类
3. 在 GameScene 中加载和实例化

### 修改物理参数

在 `src/main.ts` 中修改物理配置：

```typescript
physics: {
    default: 'arcade',
    arcade: {
        gravity: { x: 0, y: 980 },
        debug: false  // 设为 true 查看物理调试信息
    }
}
```

## 技术栈

- **Phaser 3.80** - 游戏引擎
- **TypeScript 5.3** - 类型安全
- **Vite 5** - 构建工具
- **Arcade Physics** - 物理引擎

## 发布到小游戏平台

### 微信小游戏

1. 修改 `vite.config.ts` 添加微信小游戏适配
2. 使用微信开发者工具预览 `dist` 目录
3. 配置 appid 后发布

### 抖音小游戏

1. 同上，使用字节跳动适配层
2. 使用抖音开发者工具预览

### 支付宝小游戏

1. 同上，使用支付宝适配层
2. 使用支付宝开发者工具预览

## 待实现功能

- [ ] 移动端触摸控制
- [ ] 音效和背景音乐
- [ ] 关卡星级评价
- [ ] 成就系统
- [ ] 排行榜
- [ ] 小游戏平台适配层

## 故障排查

### 游戏不运行
1. 确认已执行 `npm install`
2. 检查浏览器控制台是否有错误
3. 确认端口 3000 没有被占用

### 物理调试
在 `src/main.ts` 中设置 `debug: true` 查看物理碰撞体

### 关卡加载失败
确认 `public/assets/data/` 目录下有对应的 JSON 文件

## 参考资料

- [Phaser 3 官方文档](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 示例](https://phaser.io/examples)
- [Arcade Physics 文档](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.html)

## 许可证

本项目仅用于学习和参考。
