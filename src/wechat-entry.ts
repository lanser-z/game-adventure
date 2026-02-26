/**
 * 微信小游戏适配入口
 * 这个文件会被微信小游戏加载，用于启动 Phaser 游戏
 */

// 微信小游戏全局类型声明
declare const wx: any;

import Phaser from 'phaser';

// 导入适配的样式
import './index.css';

// Phaser 游戏主类
import TeaEggGame from './main';

// 等待 DOM 加载完成
window.onload = () => {
    // 适配微信小游戏的 Canvas
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    if (!canvas) {
        console.error('[Wechat] 找不到 game-canvas 元素');
        return;
    }

    // 微信小游戏环境配置
    if (typeof wx !== 'undefined') {
        // 获取系统信息
        const sysInfo = wx.getSystemInfoSync();
        console.log('[Wechat] 系统信息:', sysInfo);

        // 设置 Canvas 尺寸
        const designWidth = 960;
        const designHeight = 640;

        canvas.width = designWidth;
        canvas.height = designHeight;

        // 保持宽高比
        const container = canvas.parentElement;
        if (container) {
            (container as HTMLElement).style.width = sysInfo.screenWidth + 'px';
            (container as HTMLElement).style.height = sysInfo.screenHeight + 'px';
            (container as HTMLElement).style.display = 'flex';
            (container as HTMLElement).style.justifyContent = 'center';
            (container as HTMLElement).style.alignItems = 'center';
        }

        // 监听内存警告
        wx.onMemoryWarning((res: any) => {
            console.warn('[Wechat] 内存警告:', res);
            // 可以在这里清理资源
        });

        // 监听网络状态
        wx.onNetworkStatusChange((res: any) => {
            console.log('[Wechat] 网络状态变化:', res);
        });

        // 设置屏幕方向
        wx.setScreenOrientation({
            orientation: 'portrait-primary'
        });

        // 设置分享
        wx.onShareAppMessage(() => {
            return {
                title: '来玩茶叶蛋大冒险！20个益智关卡等你挑战',
                imageUrl: ''
            };
        });

        // 显示分享按钮
        wx.showShareMenu({
            withShareTicket: true,
            menus: [
                'shareAppMessage',
                'shareTimeline'
            ]
        });
    }

    // 创建游戏实例
    const game = new TeaEggGame({
        type: Phaser.AUTO,
        width: 960,
        height: 640,
        parent: 'game-container',
        backgroundColor: '#2c3e50',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { x: 0, y: 0 },
                debug: false // 发布时关闭调试
            }
        },
        scene: [], // 场景在 main.ts 中定义，这里不需要重复
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: {
            pixelArt: true,
            antialias: false
        },
        // 微信小游戏特定配置
        canvas: canvas,
        audio: {
            noAudio: false
        }
    });

    // 保存到全局
    (window as any).game = game;

    // 隐藏加载动画
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 500);
};

// 导出给微信小游戏
export default {};
