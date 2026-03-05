/**
 * 启动场景
 * 负责加载游戏资源和初始化全局数据
 */

import Phaser from 'phaser';
import { wechatAdapter } from '../platform/WechatAdapter';
import { AssetsConfig, AssetList } from '../config/AssetsConfig';

// 总关卡数
const TOTAL_LEVELS = 60;

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('[BootScene] 构造函数执行');
    }

    preload(): void {
        console.log('[BootScene] preload 开始');
        console.log('[BootScene] 场景尺寸:', this.cameras.main.width, 'x', this.cameras.main.height);
        console.log('[BootScene] 资源来源:', AssetsConfig.useRemote ? 'CDN' : '本地');
        if (AssetsConfig.useRemote) {
            console.log('[BootScene] CDN 地址:', AssetsConfig.remoteBase);
        }

        // 加载音频资源
        this.loadAudioAssets();

        // 动态加载所有关卡 JSON 文件
        this.loadLevelJsons();

        // 微信小游戏不能直接通过 load.image 加载本地文件
        // 需要在 create 中手动处理
        console.log('[BootScene] 跳过 preload 中的图片加载，将在 create 中处理');

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

        // 监听真实加载进度
        this.load.on('progress', (value: number) => {
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
    }

    /**
     * 加载音频资源（支持远程 CDN）
     */
    private loadAudioAssets(): void {
        // 背景音乐
        this.load.audio('bgm_main', AssetList.getAudioPath('bgm_main.mp3'));

        // 音效
        const soundEffects = ['jump', 'doubleJump', 'collect', 'door', 'death', 'bounce', 'button'];
        soundEffects.forEach(effect => {
            this.load.audio(`sfx_${effect}`, AssetList.getAudioPath(`sfx_${effect}.mp3`));
        });

        console.log(`[BootScene] 音频资源路径: ${AssetsConfig.useRemote ? AssetsConfig.remoteBase : AssetsConfig.localBase}`);

        // 音频加载错误处理（可选文件）
        this.load.on('loaderror', (fileObj: any) => {
            if (fileObj.type === 'audio') {
                console.log(`[BootScene] 音频文件加载失败（可选）: ${fileObj.key}`);
            } else if (fileObj.type === 'json') {
                console.warn(`[BootScene] JSON 文件加载失败: ${fileObj.key} from ${fileObj.url}`);
            } else {
                console.warn(`[BootScene] 资源加载失败: ${fileObj.key} (${fileObj.type})`);
            }
        });
    }

    /**
     * 动态加载关卡 JSON 文件
     */
    private loadLevelJsons(): void {
        console.log('[BootScene] 开始加载关卡 JSON 文件...');
        for (let i = 1; i <= TOTAL_LEVELS; i++) {
            const key = `level${i}`;
            const url = AssetsConfig.getLevelJsonUrl(i);
            this.load.json(key, url);
        }
        console.log(`[BootScene] 已添加 ${TOTAL_LEVELS} 个关卡 JSON 到加载队列`);
    }

    create(): void {
        console.log('[BootScene] create 开始');

        // 加载玩家图片（微信小游戏特殊处理）
        this.loadPlayerImages().then(() => {
            console.log('[BootScene] 玩家图片加载完成');
            this.continueCreate();
        });
    }

    /**
     * 加载玩家图片（支持远程 CDN）
     */
    private async loadPlayerImages(): Promise<void> {
        const playerImages = AssetList.playerImages;

        const promises = playerImages.map(name => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image();
                // 支持跨域加载
                img.crossOrigin = 'anonymous';

                img.onload = () => {
                    // 创建 Canvas 纹理
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(img, 0, 0);

                    // 添加到 Phaser 纹理管理器
                    this.textures.addCanvas(`player_${name}`, canvas);
                    console.log(`[BootScene] 加载玩家图片: ${name} (来源: ${AssetsConfig.useRemote ? '远程' : '本地'})`);
                    resolve();
                };
                img.onerror = () => {
                    console.error(`[BootScene] 加载玩家图片失败: ${name}`);
                    reject(new Error(`Failed to load ${name}`));
                };
                // 使用配置的 URL
                img.src = AssetList.getPlayerImagePath(name);
            });
        });

        await Promise.all(promises);
    }

    /**
     * 继续创建（在图片加载完成后）
     */
    private continueCreate(): void {
        // 关卡数据已在 preload 中通过 Phaser Loader 加载并自动缓存
        // Phaser 的 loader 会自动将 JSON 数据存入 cache.json
        console.log('[BootScene] 关卡 JSON 已通过 Loader 自动缓存');

        // 验证部分关卡数据已加载
        const sampleKeys = ['level1', 'level2', 'level10'];
        sampleKeys.forEach(key => {
            if (this.cache.json.exists(key)) {
                console.log(`[BootScene] 验证缓存: ${key} 已就绪`);
            } else {
                console.warn(`[BootScene] 警告: ${key} 未找到`);
            }
        });

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
        console.log(`[BootScene] 设置 totalLevels = ${TOTAL_LEVELS}`);
        this.registry.set('totalLevels', TOTAL_LEVELS);
        console.log(`[BootScene] 验证: registry.get('totalLevels') = ${this.registry.get('totalLevels')}`);

        // 初始化微信适配器
        wechatAdapter.init();

        // 最大解锁关卡（使用微信适配器读取）
        const savedProgress = wechatAdapter.getStorageSync('littleFrogAdventure');
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
                title: '来玩小青蛙的奇妙冒险！60个益智关卡等你挑战',
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

        wechatAdapter.setStorageSync('littleFrogAdventure', data);
    }
}
