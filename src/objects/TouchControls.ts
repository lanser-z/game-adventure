/**
 * 虚拟按键控制 - 移动端触摸控制
 * 使用 Phaser Zone 和多指针支持
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
    private leftZone!: Phaser.GameObjects.Zone;
    private rightZone!: Phaser.GameObjects.Zone;
    private jumpZone!: Phaser.GameObjects.Zone;

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
            buttonSize: config.buttonSize || 80,
            buttonAlpha: config.buttonAlpha || 0.6,
            horizontalSpacing: config.horizontalSpacing || 20,
            bottomMargin: config.bottomMargin || 30
        };

        // 启用多点触控支持（添加额外的指针）
        // Phaser 3 默认只支持 1 个指针，需要添加更多来支持多点触控
        for (let i = 1; i < 5; i++) {
            this.scene.input.addPointer();
        }
        // @ts-ignore - pointerCount 是运行时属性
        console.log('[TouchControls] 多点触控已启用，指针数量:', (this.scene.input as any).pointerCount);

        this.createControls();
        this.setupTouchEvents();
    }

    private createControls(): void {
        const { buttonSize, bottomMargin } = this.config;
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        // 左侧区域 - 移动按钮 (两个按钮并排)
        const leftX = 60 + buttonSize / 2;
        const leftY = screenHeight - bottomMargin - buttonSize / 2;

        // 左移按钮区域
        this.leftZone = this.scene.add.zone(
            leftX - buttonSize / 2,
            leftY - buttonSize / 2,
            buttonSize,
            buttonSize
        );
        this.leftZone.setOrigin(0);
        this.leftZone.setScrollFactor(0);
        this.leftZone.setInteractive();

        // 左移按钮视觉
        const leftBg = this.scene.add.circle(leftX, leftY, buttonSize / 2, 0x4a90d9, this.config.buttonAlpha);
        leftBg.setStrokeStyle(3, 0xffffff, 0.8);
        leftBg.setScrollFactor(0);

        const leftText = this.scene.add.text(leftX, leftY, '◀', {
            fontSize: `${buttonSize * 0.5}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        leftText.setScrollFactor(0);

        // 右移按钮区域
        const rightX = leftX + buttonSize + this.config.horizontalSpacing;
        this.rightZone = this.scene.add.zone(
            rightX - buttonSize / 2,
            leftY - buttonSize / 2,
            buttonSize,
            buttonSize
        );
        this.rightZone.setOrigin(0);
        this.rightZone.setScrollFactor(0);
        this.rightZone.setInteractive();

        // 右移按钮视觉
        const rightBg = this.scene.add.circle(rightX, leftY, buttonSize / 2, 0x4a90d9, this.config.buttonAlpha);
        rightBg.setStrokeStyle(3, 0xffffff, 0.8);
        rightBg.setScrollFactor(0);

        const rightText = this.scene.add.text(rightX, leftY, '▶', {
            fontSize: `${buttonSize * 0.5}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        rightText.setScrollFactor(0);

        // 右侧区域 - 跳跃按钮
        const jumpX = screenWidth - 60 - buttonSize / 2;
        this.jumpZone = this.scene.add.zone(
            jumpX - buttonSize / 2,
            leftY - buttonSize / 2,
            buttonSize,
            buttonSize
        );
        this.jumpZone.setOrigin(0);
        this.jumpZone.setScrollFactor(0);
        this.jumpZone.setInteractive();

        // 跳跃按钮视觉
        const jumpBg = this.scene.add.circle(jumpX, leftY, buttonSize / 2, 0xe67e22, this.config.buttonAlpha);
        jumpBg.setStrokeStyle(3, 0xffffff, 0.8);
        jumpBg.setScrollFactor(0);

        const jumpText = this.scene.add.text(jumpX, leftY, '⬆', {
            fontSize: `${buttonSize * 0.5}px`,
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        jumpText.setScrollFactor(0);

        // 存储视觉元素引用
        (this.leftZone as any).visualBg = leftBg;
        (this.rightZone as any).visualBg = rightBg;
        (this.jumpZone as any).visualBg = jumpBg;
    }

    private setupTouchEvents(): void {
        // 左移按钮
        this.leftZone.on('pointerdown', () => {
            this.leftDown = true;
            (this.leftZone as any).visualBg.setAlpha(1);
        });
        this.leftZone.on('pointerup', () => {
            this.leftDown = false;
            (this.leftZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });
        this.leftZone.on('pointerupoutside', () => {
            this.leftDown = false;
            (this.leftZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });

        // 右移按钮
        this.rightZone.on('pointerdown', () => {
            this.rightDown = true;
            (this.rightZone as any).visualBg.setAlpha(1);
        });
        this.rightZone.on('pointerup', () => {
            this.rightDown = false;
            (this.rightZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });
        this.rightZone.on('pointerupoutside', () => {
            this.rightDown = false;
            (this.rightZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });

        // 跳跃按钮
        this.jumpZone.on('pointerdown', () => {
            this.jumpDown = true;
            (this.jumpZone as any).visualBg.setAlpha(1);
        });
        this.jumpZone.on('pointerup', () => {
            this.jumpDown = false;
            (this.jumpZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });
        this.jumpZone.on('pointerupoutside', () => {
            this.jumpDown = false;
            (this.jumpZone as any).visualBg.setAlpha(this.config.buttonAlpha);
        });

        console.log('[TouchControls] 触摸事件已设置');
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
        this.leftZone.destroy();
        this.rightZone.destroy();
        this.jumpZone.destroy();
    }

    /**
     * 显示/隐藏控制按钮
     */
    public setVisible(visible: boolean): void {
        this.leftZone.setVisible(visible);
        this.rightZone.setVisible(visible);
        this.jumpZone.setVisible(visible);
    }
}
