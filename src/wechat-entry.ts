/**
 * 微信小游戏入口
 * weapp-adapter 会在 HTML 中通过 script 标签加载
 */

// 微信小游戏全局类型声明
declare const wx: any;
declare const GameGlobal: any;

// 导入平台适配器
import { platformManager } from './platform/PlatformManager';

// 导入 Phaser 游戏
import Phaser from 'phaser';
import { TeaEggGame, baseConfig } from './main';

// 初始化游戏
window.onload = () => {
    console.log('[Wechat-INIT] 游戏开始初始化...');

    // 初始化平台
    platformManager.init();
    console.log('[Wechat-INIT] 平台初始化完成');

    // 获取 Canvas - 微信环境使用全局 canvas
    let canvas: HTMLCanvasElement | undefined = (window as any).canvas;
    console.log('[Wechat-INIT] 全局 canvas:', canvas ? '存在' : '不存在');
    
    // 如果没有全局 canvas，从 document 获取
    if (!canvas) {
        console.log('[Wechat-INIT] 尝试从 document 获取 canvas');
        canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        console.log('[Wechat-INIT] document canvas:', canvas ? '存在' : '不存在');
    }

    // 如果还没有，创建一个
    if (!canvas) {
        console.log('[Wechat-INIT] 创建新 canvas');
        canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        canvas.width = 960;
        canvas.height = 640;
        console.log('[Wechat-INIT] 新 canvas 尺寸:', canvas.width, 'x', canvas.height);
    }

    // 基于基础配置创建微信环境配置
    console.log('[Wechat-INIT] 创建游戏配置...');

    // 微信环境：明确告诉 Phaser 不使用 DOM parent
    const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL,
        width: 960,
        height: 640,
        parent: null,  // 明确设置为 null，告诉 Phaser 不使用父元素
        canvas: canvas,
        backgroundColor: '#2c3e50',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false
            }
        },
        scene: baseConfig.scene,
        scale: {
            mode: Phaser.Scale.NONE,  // 禁用自动缩放
            autoCenter: Phaser.Scale.NO_CENTER
        },
        render: {
            pixelArt: true,
            antialias: false
        }
    };

    console.log('[Wechat-INIT] gameConfig.canvas:', gameConfig.canvas ? '已设置' : '未设置');
    console.log('[Wechat-INIT] gameConfig.parent:', gameConfig.parent);
    console.log('[Wechat-INIT] gameConfig.scale:', gameConfig.scale);

    // 微信环境特殊处理
    if (canvas) {
        const wx = (window as any).wx;
        if (wx) {
            const sysInfo = wx.getSystemInfoSync();
            console.log('[Wechat-INIT] 系统信息:', sysInfo);

            // 监听内存警告
            wx.onMemoryWarning(() => {
                console.warn('[Wechat-INIT] 内存警告');
            });

            // 设置分享
            platformManager.setupShare('来玩茶叶蛋大冒险！');
        }
    }

    // 创建游戏实例
    console.log('[Wechat-INIT] 创建 TeaEggGame 实例...');
    const game = new TeaEggGame(gameConfig);
    (window as any).game = game;
    console.log('[Wechat-INIT] 游戏实例已创建:', game);

    // 监听游戏就绪事件
    game.events.once('ready', () => {
        console.log('[Wechat-GAME] 游戏已就绪 (ready 事件)');
    });

    // 监听 BootScene 启动
    game.events.once('start', () => {
        console.log('[Wechat-GAME] 游戏启动 (start 事件)');
    });

    // 隐藏加载动画
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 500);

    console.log('[Wechat-INIT] 游戏初始化完成，等待场景加载...');
};

export {};
