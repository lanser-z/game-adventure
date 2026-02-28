/**
 * 小青蛙的奇妙冒险 - Phaser 3 主入口文件
 */

import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { BootScene } from './scenes/BootScene';
import { EditorScene } from './scenes/EditorScene';

/**
 * 游戏配置（基础配置，不包含 parent）
 */
export const baseConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // 不设置全局重力
            debug: false // 生产环境关闭调试
        }
    },
    scene: [BootScene, MainMenuScene, LevelSelectScene, GameScene, EditorScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        pixelArt: true, // 像素艺术风格
        antialias: false
    }
};

/**
 * 游戏主类
 */
export class LittleFrogGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// 只在 Web 环境自动初始化
// 检测是否在小游戏环境
const isMiniGame = typeof (window as any).wx !== 'undefined' ||
                   typeof (window as any).my !== 'undefined' ||
                   typeof (window as any).tt !== 'undefined';

if (!isMiniGame) {
    // Web 环境：自动初始化
    window.onload = () => {
        const webConfig = {
            ...baseConfig,
            parent: 'game-container'
        };
        const game = new LittleFrogGame(webConfig);
        (window as any).game = game;

        // 隐藏加载动画
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.display = 'none';
            }
        }, 1000);
    };
}

// 导出默认
export default LittleFrogGame;
