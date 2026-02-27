/**
 * 主菜单场景
 */

import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
    private titleText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MainMenuScene' });
        console.log('[MainMenuScene] 构造函数执行');
    }

    create(): void {
        console.log('[MainMenuScene] create 开始');
        const { width, height } = this.cameras.main;
        console.log('[MainMenuScene] 场景尺寸:', width, 'x', height);

        // 背景
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);
        console.log('[MainMenuScene] 背景已创建');

        // 标题
        this.titleText = this.add.text(width / 2, height / 4, '小青蛙大冒险', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#333333',
            strokeThickness: 6
        });
        this.titleText.setOrigin(0.5);
        console.log('[MainMenuScene] 标题已创建');

        // 副标题
        const subtitle = this.add.text(width / 2, height / 4 + 60, 'Little Frog Adventure', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#cccccc'
        });
        subtitle.setOrigin(0.5);

        // 创建按钮
        console.log('[MainMenuScene] 创建按钮...');
        this.createButtons();
        console.log('[MainMenuScene] 按钮创建完成');

        // 添加浮动动画
        this.tweens.add({
            targets: this.titleText,
            y: this.titleText.y - 10,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        console.log('[MainMenuScene] create 完成');
    }

    /**
     * 创建菜单按钮
     */
    private createButtons(): void {
        const { width, height } = this.cameras.main;
        const buttonY = height / 2;
        const buttonSpacing = 70;

        // 开始游戏按钮
        this.createButton(
            width / 2,
            buttonY,
            '开始游戏',
            '#4CAF50',
            () => this.startGame()
        );

        // 关卡选择按钮
        this.createButton(
            width / 2,
            buttonY + buttonSpacing,
            '关卡选择',
            '#2196F3',
            () => this.openLevelSelect()
        );

        // 关卡编辑器按钮
        this.createButton(
            width / 2,
            buttonY + buttonSpacing * 2,
            '关卡编辑器',
            '#9C27B0',
            () => this.openEditor()
        );

        // 设置按钮
        this.createButton(
            width / 2,
            buttonY + buttonSpacing * 3,
            '设置',
            '#607D8B',
            () => this.openSettings()
        );
    }

    /**
     * 创建按钮
     */
    private createButton(
        x: number,
        y: number,
        text: string,
        bgColor: string,
        callback: () => void
    ): Phaser.GameObjects.Text {
        const button = this.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: bgColor,
            padding: { x: 40, y: 15 }
        });
        button.setOrigin(0.5);
        button.setInteractive({ useHandCursor: true });

        // 悬停效果
        button.on('pointerover', () => {
            button.setScale(1.05);
        });

        button.on('pointerout', () => {
            button.setScale(1);
        });

        // 点击事件
        button.on('pointerdown', () => {
            this.playClickSound();
            callback();
        });

        return button;
    }

    /**
     * 开始游戏
     */
    private startGame(): void {
        const currentLevel = this.registry.get('currentLevel') || 1;
        this.scene.start('GameScene', { levelId: currentLevel });
    }

    /**
     * 打开关卡选择
     */
    private openLevelSelect(): void {
        this.scene.start('LevelSelectScene');
    }

    /**
     * 打开关卡编辑器
     */
    private openEditor(): void {
        this.scene.start('EditorScene');
    }

    /**
     * 打开设置
     */
    private openSettings(): void {
        // TODO: 实现设置界面
        console.log('打开设置');
    }

    /**
     * 播放点击音效
     */
    private playClickSound(): void {
        // TODO: 添加音效
    }
}
