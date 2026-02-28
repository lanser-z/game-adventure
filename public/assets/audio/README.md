# 游戏音频文件

## 音频文件列表

### 背景音乐
- `bgm_main.mp3` - 主背景音乐（循环播放）
  - 风格：轻快、愉快
  - 时长：建议 1-2 分钟循环
  - 推荐搜索关键词：happy, platformer, cute, adventure

### 音效文件
| 文件名 | 用途 | 建议时长 | 搜索关键词 |
|--------|------|----------|------------|
| `sfx_jump.mp3` | 玩家跳跃 | 0.1-0.2秒 | jump, bounce, boing |
| `sfx_doubleJump.mp3` | 二段跳 | 0.1-0.2秒 | jump high, double jump |
| `sfx_collect.mp3` | 收集物品 | 0.1-0.3秒 | coin, collect, chime |
| `sfx_door.mp3` | 通过门/关卡完成 | 0.3-0.5秒 | success, win, level complete |
| `sfx_death.mp3` | 玩家死亡 | 0.3-0.5秒 | fail, game over, death |
| `sfx_bounce.mp3` | 踩踏敌人反弹 | 0.1-0.2秒 | bounce, spring |
| `sfx_button.mp3` | 按钮交互 | 0.05-0.1秒 | click, button press |

## 音频规格建议
- **格式**: MP3 (兼容性好)
- **采样率**: 44.1kHz 或 48kHz
- **比特率**: 128kbps - 192kbps
- **声道**: 立体声或单声道皆可
- **背景音乐**: 需要无缝循环
- **音效**: 短促清晰，无开头/结尾静音

## 免费音频资源网站

### 中文音效网站
1. **猴子音悦** (houzi8.com)
   - 中文音效库，搜索方便
   - 支持免费下载 MP3 格式
   - 推荐：搜索"跳跃"、"门"、"游戏音效"

2. **站长素材** (sc.chinaz.com)
   - 中文音效素材站
   - 分类齐全，下载方便
   - 推荐：搜索"游戏音效"

### 国际音效网站（推荐）
1. **Freesound** (freesound.org) ⭐
   - 最大的免费音效社区
   - CC0 许可，可商用
   - 搜索技巧：使用英文关键词
   - 需注册登录下载

2. **OpenGameArt** (opengameart.org)
   - 游戏素材专门网站
   - 筛选 CC0 协议可免费使用
   - 有完整的游戏音效包

3. **Zapsplat** (zapsplat.com)
   - 专业的音效库
   - 免费账户可下载
   - 分类详细，质量高

### 背景音乐网站
1. **Bensound** (bensound.com)
   - 免费背景音乐
   - 需注明出处

2. **Incompetech** (incompetech.com)
   - Kevin MacLeod 的音乐
   - 游戏音乐经典资源

## 快速获取指南

### 方案一：下载现成的游戏音效包
1. 访问 Freesound.org
2. 搜索 "platformer sound pack" 或 "jump sound pack"
3. 下载完整的音效包
4. 解压并重命名文件

### 方案二：单独下载音效
按照以下搜索词在 Freesound 或 猴子音悦搜索：
- 跳跃: "jump" / "跳跃"
- 死亡: "game over" / "失败"
- 完成: "success" / "成功"
- 门: "door" / "门"

### 方案三：使用生成音效（临时方案）
游戏已内置 Web Audio API 生成音效功能。
如果没有音频文件，游戏会自动生成简单的蜂鸣音效作为替代。

## 安装步骤

1. 下载音频文件
2. 将文件放入 `public/assets/audio/` 目录
3. 确保文件名与上表一致
4. 刷新游戏页面

## 测试音频

游戏启动后会自动：
1. 尝试加载音频文件
2. 如果加载失败，会在控制台显示警告
3. 使用内置生成音效作为后备

打开浏览器控制台查看音频加载状态。

## 音量控制

游戏支持：
- 背景音乐音量调节
- 音效音量调节
- 一键静音

设置会自动保存到本地存储。
