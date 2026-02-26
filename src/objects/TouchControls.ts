/**
 * 虚拟按键控制 - 移动端触摸控制
 */

import Phaser from 'phaser';

export interface TouchControlConfig {
    buttonSize?: number;
    buttonAlpha?: number;
    horizontalSpacing?: number;
    bottomMargin?: number;
}

export class TouchControls {
    private scene: Phaser.Scene;
    private leftButton!: Phaser.GameObjects.Container;
    private rightButton!: Phaser.GameObjects.Container;
    private jumpButton!: Phaser.GameObjects.Container;
    
    // 虚拟按键状态
    public leftDown: boolean = false;
    public rightDown: boolean = false;
    public jumpDown: boolean = false;
    public jumpPressed: boolean = false;
    private jumpPressedPrev: boolean = false;

    private config: Required<TouchControlConfig>;

    constructor(scene: Phaser.Scene, config: TouchControlConfig = {}) {
        this.scene = scene;
        this.config = {
            buttonSize: config.buttonSize || 70,
            buttonAlpha: config.buttonAlpha || 0.7,
            horizontalSpacing: config.horizontalSpacing || 20,
            bottomMargin: config.bottomMargin || 40
        };
        
        this.createControls();
    }

    private createControls(): void {
        const { buttonSize, bottomMargin } = this.config;
        const screenHeight = this.scene.scale.height;
        
        // 左侧区域 - 移动按钮 (两个按钮并排)
        const leftX = 60 + buttonSize / 2;
        const leftY = screenHeight - bottomMargin - buttonSize / 2;
        
        // 左移按钮
        this.leftButton = this.createButton(
            leftX, 
            leftY, 
            '◀', 
            0x4a90d9
        );
        
        // 右移按钮
        this.rightButton = this.createButton(
            leftX + buttonSize + this.config.horizontalSpacing, 
            leftY, 
            '▶', 
            0x4a90d9
        );
        
        // 右侧区域 - 跳跃按钮
        const rightX = this.scene.scale.width - 60 - buttonSize / 2;
        this.jumpButton = this.createButton(
            rightX, 
            leftY, 
            '⬆', 
            0xe67e22
        );
        
        // 绑定触摸事件
        this.bindTouchEvents();
    }

    private createButton(
        x: number, 
        y: number, 
        symbol: string, 
        color: number
    ): Phaser.GameObjects.Container {
        const { buttonSize, buttonAlpha } = this.config;
        
        const container = this.scene.add.container(x, y);
        
        // 按钮背景圆形
        const bg = this.scene.add.circle(0, 0, buttonSize / 2, color, buttonAlpha);
        bg.setStrokeStyle(3, 0xffffff, 0.8);
        
        // 按钮文字/符号
        const text = this.scene.add.text(0, 0, symbol, {
            fontSize: `${buttonSize * 0.5}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        container.add([bg, text]);
        
        // 设置为可交互
        (bg as any).setInteractive({ useHandCursor: false });
        
        return container;
    }

    private bindTouchEvents(): void {
        // 左移按钮
        this.setupButtonInteraction(this.leftButton, 'left');
        
        // 右移按钮
        this.setupButtonInteraction(this.rightButton, 'right');
        
        // 跳跃按钮
        this.setupButtonInteraction(this.jumpButton, 'jump');
        
        // 全局触摸区域 - 用于检测触摸释放
        this.scene.input.on('pointerup', () => {
            // 当触摸释放时，重置所有按钮状态
            if (!this.scene.input.activePointer.isDown) {
                this.leftDown = false;
                this.rightDown = false;
                // jumpDown 在 update 中处理
            }
        });
        
        // 监听全局 pointerup 来重置按钮视觉状态
        this.scene.input.on('pointerupoutside', () => {
            this.leftDown = false;
            this.rightDown = false;
            this.jumpDown = false;
            this.updateButtonVisuals();
        });
    }

    private setupButtonInteraction(
        button: Phaser.GameObjects.Container, 
        action: 'left' | 'right' | 'jump'
    ): void {
        const bg = button.first as Phaser.GameObjects.Shape;
        
        // 触摸开始
        bg.on('pointerdown', () => {
            switch (action) {
                case 'left':
                    this.leftDown = true;
                    break;
                case 'right':
                    this.rightDown = true;
                    break;
                case 'jump':
                    this.jumpDown = true;
                    break;
            }
            this.updateButtonVisuals();
        });
        
        // 触摸结束
        bg.on('pointerup', () => {
            switch (action) {
                case 'left':
                    this.leftDown = false;
                    break;
                case 'right':
                    this.rightDown = false;
                    break;
                case 'jump':
                    this.jumpDown = false;
                    break;
            }
            this.updateButtonVisuals();
        });
        
        // 触摸取消
        bg.on('pointerupoutside', () => {
            switch (action) {
                case 'left':
                    this.leftDown = false;
                    break;
                case 'right':
                    this.rightDown = false;
                    break;
                case 'jump':
                    this.jumpDown = false;
                    break;
            }
            this.updateButtonVisuals();
        });
    }

    private updateButtonVisuals(): void {
        const { buttonAlpha } = this.config;
        
        // 更新左按钮视觉
        const leftBg = this.leftButton.first as Phaser.GameObjects.Shape;
        leftBg.setAlpha(this.leftDown ? 1 : buttonAlpha);
        
        // 更新右按钮视觉
        const rightBg = this.rightButton.first as Phaser.GameObjects.Shape;
        rightBg.setAlpha(this.rightDown ? 1 : buttonAlpha);
        
        // 更新跳跃按钮视觉
        const jumpBg = this.jumpButton.first as Phaser.GameObjects.Shape;
        jumpBg.setAlpha(this.jumpDown ? 1 : buttonAlpha);
    }

    /**
     * 更新按键状态 - 在 Player 更新前调用
     * 返回跳跃是否刚刚按下（用于二段跳检测）
     */
    public update(): boolean {
        // 检测跳跃按钮的上升沿（刚刚按下）
        this.jumpPressed = this.jumpDown && !this.jumpPressedPrev;
        this.jumpPressedPrev = this.jumpDown;
        
        return this.jumpPressed;
    }

    /**
     * 销毁控件
     */
    public destroy(): void {
        this.leftButton.destroy();
        this.rightButton.destroy();
        this.jumpButton.destroy();
    }

    /**
     * 显示/隐藏控制按钮
     */
    public setVisible(visible: boolean): void {
        this.leftButton.setVisible(visible);
        this.rightButton.setVisible(visible);
        this.jumpButton.setVisible(visible);
    }

    /**
     * 启用/禁用控制按钮
     */
    public setEnabled(enabled: boolean): void {
        const leftBg = this.leftButton.first as Phaser.GameObjects.Shape;
        const rightBg = this.rightButton.first as Phaser.GameObjects.Shape;
        const jumpBg = this.jumpButton.first as Phaser.GameObjects.Shape;
        
        (leftBg as any).setInteractive({ enabled: enabled });
        (rightBg as any).setInteractive({ enabled: enabled });
        (jumpBg as any).setInteractive({ enabled: enabled });
        
        if (!enabled) {
            this.leftDown = false;
            this.rightDown = false;
            this.jumpDown = false;
            this.updateButtonVisuals();
        }
    }
}
