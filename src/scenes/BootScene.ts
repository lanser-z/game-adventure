/**
 * 启动场景
 * 负责加载游戏资源和初始化全局数据
 */

import Phaser from 'phaser';
import { wechatAdapter } from '../platform/WechatAdapter';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('[BootScene] 构造函数执行');
    }

    preload(): void {
        console.log('[BootScene] preload 开始');
        console.log('[BootScene] 场景尺寸:', this.cameras.main.width, 'x', this.cameras.main.height);

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

        // 加载进度事件
        this.load.on('progress', (value: number) => {
            console.log('[BootScene] 加载进度:', Math.floor(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x4CAF50, 1);
            progressBar.fillRect(250, 280, 460 * value, 30);
            percentText.setText(`${Math.floor(value * 100)}%`);
        });

        this.load.on('complete', () => {
            console.log('[BootScene] 资源加载完成');
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // 加载游戏资源
        this.loadGameAssets();

        // 添加加载错误处理
        this.load.on('loaderror', (fileObj: any) => {
            console.error('[BootScene] 资源加载失败:', fileObj.key, fileObj);
        });
    }

    create(): void {
        console.log('[BootScene] create 开始');

        // 初始化全局数据
        this.initGlobalData();

        // 跳转到主菜单
        console.log('[BootScene] 准备跳转到 MainMenuScene');
        this.scene.start('MainMenuScene');
    }

    /**
     * 加载游戏资源
     */
    private loadGameAssets(): void {
        // ========== 玩家资源 ==========
        // 使用 SVG 转换为 Base64 或使用简单的图形绘制
        // 这里我们使用 Phaser 的 Graphics 动态绘制，不依赖外部图片

        // ========== 环境资源 ==========
        // 平台、箱子、门、按钮等

        // ========== UI 资源 ==========
        // 按钮等

        // 加载关卡数据（全部20关）
        // 微信小游戏环境使用相对路径（不以 / 开头）
        for (let i = 1; i <= 20; i++) {
            this.load.json(`level${i}`, `assets/data/level${i}.json`);
        }
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
