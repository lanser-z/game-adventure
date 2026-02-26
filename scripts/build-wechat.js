#!/usr/bin/env node

/**
 * 微信小游戏构建脚本
 * 将项目构建为微信小游戏可用的格式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../dist');
const wechatDir = path.join(__dirname, '../dist-wechat');

console.log('[Build] 开始构建微信小游戏...');

if (fs.existsSync(wechatDir)) {
    fs.rmSync(wechatDir, { recursive: true, force: true });
}
fs.mkdirSync(wechatDir, { recursive: true });

function copyRecursive(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

if (fs.existsSync(sourceDir)) {
    console.log('[Build] 复制构建文件...');
    copyRecursive(sourceDir, wechatDir);
} else {
    console.error('[Build] 请先运行 npm run build');
    process.exit(1);
}

const mainJsPath = path.join(wechatDir, 'assets');
const jsFiles = fs.readdirSync(mainJsPath).filter(f => f.startsWith('wechat-') && f.endsWith('.js'));

if (jsFiles.length > 0) {
    const wechatJsFile = jsFiles[0];
    console.log(`[Build] 找到入口文件: ${wechatJsFile}`);

    // 微信小游戏 game.js 必须使用 require
    // 正确顺序：MutationObserver.js → symbol.js → weapp-adapter.js → document-polyfill.js → 游戏代码
    const wechatEntryJs = `
// 微信小游戏入口文件
console.log('[game.js] 开始加载微信小游戏...');

// 1. MutationObserver polyfill
console.log('[game.js] 加载 MutationObserver.js');
require('./assets/MutationObserver.js');

// 2. symbol.js (ES6 支持)
console.log('[game.js] 加载 symbol.js');
require('./assets/symbol.js');

// 3. weapp-adapter.js (创建 window 和 canvas)
console.log('[game.js] 加载 weapp-adapter.js');
require('./assets/weapp-adapter.js');

// 4. document polyfill (添加 Phaser 3 需要的 document 方法)
console.log('[game.js] 加载 document-polyfill.js');
require('./assets/document-polyfill.js');

// 5. 加载游戏代码
console.log('[game.js] 加载游戏代码: ${wechatJsFile}');
require('./assets/${wechatJsFile}');

console.log('[game.js] 所有必要文件已加载');
`;

    fs.writeFileSync(path.join(wechatDir, 'game.js'), wechatEntryJs);
    console.log('[Build] 创建微信小游戏入口文件: game.js');
} else {
    console.error('[Build] 未找到微信入口 JS 文件');
}

const gameJsonPath = path.join(wechatDir, 'game.json');
if (fs.existsSync(gameJsonPath)) {
    const gameJsonContent = fs.readFileSync(gameJsonPath, 'utf-8');
    const gameJson = JSON.parse(gameJsonContent);

    gameJson.deviceOrientation = 'landscape';  // 横屏模式
    gameJson.showStatusBar = false;
    gameJson.networkTimeout = {
        request: 10000,
        downloadFile: 10000
    };
    // 移除 openDataContext 和 workers 以避免相关错误
    delete gameJson.openDataContext;
    delete gameJson.workers;

    fs.writeFileSync(gameJsonPath, JSON.stringify(gameJson, null, 2));
}

// 删除微信小游戏不需要的 HTML 文件
console.log('[Build] 清理不需要的文件...');
const htmlFiles = ['index.html', 'index.wechat.html'];
htmlFiles.forEach(file => {
    const filePath = path.join(wechatDir, file);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[Build] 删除: ${file}`);
    }
});

// 删除 assets/data 目录中的 JSON 文件（游戏使用打包后的 JS 文件）
const dataDir = path.join(wechatDir, 'assets/data');
if (fs.existsSync(dataDir)) {
    const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    jsonFiles.forEach(file => {
        const filePath = path.join(dataDir, file);
        fs.unlinkSync(filePath);
        console.log(`[Build] 删除不需要的JSON: assets/data/${file}`);
    });
}

// 复制 document polyfill 文件
const polyfillSource = path.join(__dirname, '../src/platforms/adapter/document-polyfill.js');
const polyfillDest = path.join(wechatDir, 'assets/document-polyfill.js');
if (fs.existsSync(polyfillSource)) {
    fs.copyFileSync(polyfillSource, polyfillDest);
    console.log('[Build] 复制 document-polyfill.js');
}

console.log('[Build] 微信小游戏构建完成！');
console.log('[Build] 构建目录: dist-wechat/');
console.log('[Build] 请使用微信开发者工具打开 dist-wechat/ 目录');
