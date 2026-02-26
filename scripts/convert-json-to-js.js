#!/usr/bin/env node

/**
 * 将 JSON 关卡数据转换为 JS 文件
 * 微信小游戏不支持 XHR 加载本地 JSON，需要转换为 JS 模块
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/assets/data');
const targetDir = path.join(__dirname, '../src/assets/data');

console.log('[Convert] 开始转换 JSON 文件为 JS 文件...');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 读取所有 JSON 文件
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file.replace('.json', '.js'));

    const jsonContent = fs.readFileSync(sourcePath, 'utf-8');
    const data = JSON.parse(jsonContent);

    // 转换为 ES 模块格式
    const jsContent = `// 自动生成的关卡数据
export default ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(targetPath, jsContent);
    console.log(`[Convert] ${file} -> ${file.replace('.json', '.js')}`);
});

console.log(`[Convert] 完成！转换了 ${files.length} 个文件`);
console.log(`[Convert] 输出目录: ${targetDir}`);
