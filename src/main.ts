/**
 * 茶叶蛋大冒险 - Phaser 3 主入口文件
 */

import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { BootScene } from './scenes/BootScene';
import { EditorScene } from './scenes/EditorScene';

/**
 * 游戏配置
 */
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // 不设置全局重力
            debug: true // 开启调试以便查看问题
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
class TeaEggGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

// 初始化游戏
window.onload = () => {
    const game = new TeaEggGame(config);
    (window as any).game = game;

    // 隐藏加载动画
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 1000);
};

// 导出游戏类型
export default TeaEggGame;
