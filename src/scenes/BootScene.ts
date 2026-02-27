/**
 * 启动场景
 * 负责加载游戏资源和初始化全局数据
 */

import Phaser from 'phaser';
import { wechatAdapter } from '../platform/WechatAdapter';

// 关卡数据模块 - 使用 @ 别名从 src 目录开始
// @ts-ignore - JS 文件由 scripts/convert-json-to-js.js 生成
import level1Module from '@/assets/data/level1.js';
// @ts-ignore
import level2Module from '@/assets/data/level2.js';
// @ts-ignore
import level3Module from '@/assets/data/level3.js';
// @ts-ignore
import level4Module from '@/assets/data/level4.js';
// @ts-ignore
import level5Module from '@/assets/data/level5.js';
// @ts-ignore
import level6Module from '@/assets/data/level6.js';
// @ts-ignore
import level7Module from '@/assets/data/level7.js';
// @ts-ignore
import level8Module from '@/assets/data/level8.js';
// @ts-ignore
import level9Module from '@/assets/data/level9.js';
// @ts-ignore
import level10Module from '@/assets/data/level10.js';
// @ts-ignore
import level11Module from '@/assets/data/level11.js';
// @ts-ignore
import level12Module from '@/assets/data/level12.js';
// @ts-ignore
import level13Module from '@/assets/data/level13.js';
// @ts-ignore
import level14Module from '@/assets/data/level14.js';
// @ts-ignore
import level15Module from '@/assets/data/level15.js';
// @ts-ignore
import level16Module from '@/assets/data/level16.js';
// @ts-ignore
import level17Module from '@/assets/data/level17.js';
// @ts-ignore
import level18Module from '@/assets/data/level18.js';
// @ts-ignore
import level19Module from '@/assets/data/level19.js';
// @ts-ignore
import level20Module from '@/assets/data/level20.js';

// 关卡数据映射
const levelDataMap: Record<number, any> = {
    1: level1Module, 2: level2Module, 3: level3Module, 4: level4Module, 5: level5Module,
    6: level6Module, 7: level7Module, 8: level8Module, 9: level9Module, 10: level10Module,
    11: level11Module, 12: level12Module, 13: level13Module, 14: level14Module, 15: level15Module,
    16: level16Module, 17: level17Module, 18: level18Module, 19: level19Module, 20: level20Module
};

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('[BootScene] 构造函数执行');
    }

    preload(): void {
        console.log('[BootScene] preload 开始');
        console.log('[BootScene] 场景尺寸:', this.cameras.main.width, 'x', this.cameras.main.height);

        // 加载玩家精灵图片
        const playerImages = [
            'idle_1', 'idle_2',
            'walk_left_1', 'walk_left_2',
            'jump', 'fall'
        ];

        playerImages.forEach(name => {
            this.load.image(`player_${name}`, `assets/player/${name}.png`);
        });

        console.log('[BootScene] 开始加载玩家图片...');

        // 创建加载进度条
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 480, 50);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', {
            fontSize: '32px',
            color: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.add.text(width / 2, height / 2 + 80, '0%', {
            fontSize: '28px',
            color: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        // 模拟加载进度（数据已通过 ES 模块导入）
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            if (progress > 100) progress = 100;
            progressBar.clear();
            progressBar.fillStyle(0x4CAF50, 1);
            progressBar.fillRect(250, 280, 460 * (progress / 100), 30);
            percentText.setText(`${progress}%`);
            if (progress >= 100) {
                clearInterval(progressInterval);
                this.load.emit('complete');
            }
        }, 100);

        this.load.on('complete', () => {
            console.log('[BootScene] 资源加载完成');
            clearInterval(progressInterval);
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }

    create(): void {
        console.log('[BootScene] create 开始');

        // 将关卡数据存入缓存，供 GameScene 使用
        console.log('[BootScene] 将关卡数据存入缓存...');
        for (let i = 1; i <= 20; i++) {
            const key = `level${i}`;
            const data = levelDataMap[i];
            // 使用 Phaser 3 JSON 缓存 API
            this.cache.json.add(key, data);
            console.log(`[BootScene] 缓存关卡数据: ${key}`);
        }

        // 初始化全局数据
        this.initGlobalData();

        // 跳转到主菜单
        console.log('[BootScene] 准备跳转到 MainMenuScene');
        this.scene.start('MainMenuScene');
    }

    /**
     * 初始化全局数据
     */
    private initGlobalData(): void {
        // 游戏总关卡数
        this.registry.set('totalLevels', 20);

        // 初始化微信适配器
        wechatAdapter.init();

        // 最大解锁关卡（使用微信适配器读取）
        const savedProgress = wechatAdapter.getStorageSync('teaEggAdventure');
        if (savedProgress) {
            try {
                const data = JSON.parse(savedProgress);
                this.registry.set('maxUnlockedLevel', data.maxUnlockedLevel || 1);
                this.registry.set('levelStars', data.levelStars || {});
            } catch (e) {
                this.registry.set('maxUnlockedLevel', 1);
                this.registry.set('levelStars', {});
            }
        } else {
            this.registry.set('maxUnlockedLevel', 1);
            this.registry.set('levelStars', {});
        }

        // 设置分享信息
        wechatAdapter.onShareAppMessage(() => {
            return {
                title: '来玩茶叶蛋大冒险！20个益智关卡等你挑战',
                imageUrl: ''
            };
        });

        // 显示分享按钮
        wechatAdapter.showShareButton();

        // 屏幕保持常亮
        wechatAdapter.setKeepScreenOn(true);
    }

    /**
     * 保存游戏进度
     */
    public static saveProgress(scene: Phaser.Scene): void {
        const maxUnlockedLevel = scene.registry.get('maxUnlockedLevel');
        const levelStars = scene.registry.get('levelStars');

        const data = {
            maxUnlockedLevel,
            levelStars,
            lastPlayTime: Date.now()
        };

        wechatAdapter.setStorageSync('teaEggAdventure', data);
    }
}
