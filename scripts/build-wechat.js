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

// 清空之前的构建
if (fs.existsSync(wechatDir)) {
    fs.rmSync(wechatDir, { recursive: true, force: true });
}
fs.mkdirSync(wechatDir, { recursive: true });

// 复制构建文件
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

// 复制 dist 到 wechat 目录
if (fs.existsSync(sourceDir)) {
    console.log('[Build] 复制构建文件...');
    copyRecursive(sourceDir, wechatDir);
} else {
    console.error('[Build] 请先运行 npm run build');
    process.exit(1);
}

// 创建微信小游戏入口文件
// 微信小游戏需要一个 JS 入口文件来启动游戏
const mainJsPath = path.join(wechatDir, 'assets');
const indexJsFiles = fs.readdirSync(mainJsPath).filter(f => f.startsWith('index-') && f.endsWith('.js'));

if (indexJsFiles.length > 0) {
    const indexJsFile = indexJsFiles[0];
    console.log(`[Build] 找到入口文件: ${indexJsFile}`);

    // 创建微信小游戏入口文件
    const wechatEntryJs = `
// 微信小游戏入口文件
import './assets/${indexJsFile}';
`;

    fs.writeFileSync(path.join(wechatDir, 'game.js'), wechatEntryJs);
    console.log('[Build] 创建微信小游戏入口文件: game.js');
}

// 创建微信小游戏配置文件
const gameJsonContent = fs.readFileSync(path.join(wechatDir, 'game.json'), 'utf-8');
const gameJson = JSON.parse(gameJsonContent);

// 更新配置
gameJson.deviceOrientation = 'portrait';
gameJson.showStatusBar = false;
gameJson.networkTimeout = {
    request: 10000,
    downloadFile: 10000
};

fs.writeFileSync(
    path.join(wechatDir, 'game.json'),
    JSON.stringify(gameJson, null, 2)
);

console.log('[Build] 微信小游戏构建完成！');
console.log('[Build] 构建目录: dist-wechat/');
console.log('[Build] 请使用微信开发者工具打开 dist-wechat/ 目录');
console.log('');
console.log('[Build] 发布步骤:');
console.log('[Build] 1. 打开微信开发者工具');
console.log('[Build] 2. 导入项目，选择 dist-wechat/ 目录');
console.log('[Build] 3. 填写 AppID（测试模式可以不填）');
console.log('[Build] 4. 点击预览或上传');
