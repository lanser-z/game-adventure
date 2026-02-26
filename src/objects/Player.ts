/**
 * 玩家类 - 使用 Image 以获得更好的物理支持
 */

import Phaser from 'phaser';
import { TouchControls } from './TouchControls';

export class Player extends Phaser.GameObjects.Image {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;
    private wasPressed: { up: boolean } = { up: false };

    // 触摸控制
    private touchControls: TouchControls | null = null;
    private useTouchControls: boolean = false;

    // 玩家配置
    private moveSpeed: number = 150;
    private jumpForce: number = -400;
    private maxJumps: number = 2;
    private jumpCount: number = 0;

    // 状态
    private facingRight: boolean = true;
    private isDead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // 创建纹理
        const textureKey = 'player-texture';
        const size = 40;

        if (!scene.textures.exists(textureKey)) {
            const graphics = scene.make.graphics();

            // 绘制茶叶蛋
            graphics.fillStyle(0xF5E6D3, 1);
            graphics.fillEllipse(size/2, size/2, size, size * 1.25);

            // 裂纹
            graphics.lineStyle(1.5, 0x8B7355, 1);
            graphics.lineBetween(size/2 - 8, size/2 - 12, size/2 - 6, size/2 - 2);
            graphics.lineBetween(size/2 - 6, size/2 - 2, size/2 - 8, size/2 + 8);
            graphics.lineBetween(size/2, size/2 - 14, size/2 + 2, size/2 - 4);
            graphics.lineBetween(size/2 + 2, size/2 - 4, size/2, size/2 + 6);
            graphics.lineBetween(size/2 + 8, size/2 - 10, size/2 + 6, size/2);
            graphics.lineBetween(size/2 + 6, size/2, size/2 + 8, size/2 + 10);

            // 眼睛
            graphics.fillStyle(0x333333, 1);
            graphics.fillCircle(size/2 - 7, size/2 - 2, 3);
            graphics.fillCircle(size/2 + 7, size/2 - 2, 3);

            // 眼神高光
            graphics.fillStyle(0xFFFFFF, 1);
            graphics.fillCircle(size/2 - 6, size/2 - 3, 1);
            graphics.fillCircle(size/2 + 8, size/2 - 3, 1);

            // 嘴巴
            graphics.lineStyle(2, 0x333333, 1);
            graphics.lineBetween(size/2 - 5, size/2 + 8, size/2, size/2 + 11);
            graphics.lineBetween(size/2, size/2 + 11, size/2 + 5, size/2 + 8);

            graphics.generateTexture(textureKey, size, size * 1.25);
        }

        // 使用 Image 创建玩家
        super(scene, x, y, textureKey);

        // 设置显示尺寸
        this.setDisplaySize(size, size * 1.25);

        // 添加到场景
        scene.add.existing(this);

        // 添加物理
        scene.physics.add.existing(this);

        // 设置物理属性
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(size, size * 1.25);
        body.setCollideWorldBounds(true);
        body.setBounce(0, 0);
        body.setDragX(500);

        // 确保受重力影响
        body.setAllowGravity(true);

        // 设置输入
        this.setupInput();

        // 监听更新事件
        scene.events.on('update', this.update, this);
    }

    /**
     * 设置输入控制
     */
    private setupInput(): void {
        // 键盘控制
        this.cursors = this.scene.input.keyboard!.createCursorKeys();

        // WASD 控制
        this.wasd = this.scene.input.keyboard!.addKeys('W,A,S,D,SPACE');
    }

    /**
     * 设置触摸控制
     */
    public setTouchControls(controls: TouchControls): void {
        this.touchControls = controls;
        this.useTouchControls = true;
    }

    /**
     * 启用/禁用触摸控制
     */
    public setTouchEnabled(enabled: boolean): void {
        this.useTouchControls = enabled;
    }

    /**
     * 更新玩家
     */
    public update(): void {
        if (this.isDead) return;

        this.handleInput();
        this.checkGrounded();
        this.animate();
    }

    /**
     * 处理输入
     */
    private handleInput(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // 水平移动 - 键盘
        let moveLeft = this.cursors.left.isDown || this.wasd.A.isDown;
        let moveRight = this.cursors.right.isDown || this.wasd.D.isDown;

        // 如果启用触摸控制，添加触摸输入
        if (this.useTouchControls && this.touchControls) {
            this.touchControls.update();
            
            if (this.touchControls.leftDown) {
                moveLeft = true;
            }
            if (this.touchControls.rightDown) {
                moveRight = true;
            }
        }

        // 应用水平移动
        if (moveLeft) {
            body.setVelocityX(-this.moveSpeed);
            this.facingRight = false;
        } else if (moveRight) {
            body.setVelocityX(this.moveSpeed);
            this.facingRight = true;
        } else {
            body.setVelocityX(0);
        }

        // 跳跃 - 键盘
        let jumpPressed = this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown;

        // 添加触摸跳跃输入
        if (this.useTouchControls && this.touchControls) {
            if (this.touchControls.jumpPressed) {
                jumpPressed = true;
            }
        }

        if (jumpPressed && !this.wasPressed.up && this.jumpCount < this.maxJumps) {
            body.setVelocityY(this.jumpForce);
            this.jumpCount++;
        }

        this.wasPressed.up = jumpPressed;
    }

    /**
     * 检查是否在地面
     */
    private checkGrounded(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        if (body.touching.down || body.blocked.down) {
            this.jumpCount = 0;
        }
    }

    /**
     * 动画
     */
    private animate(): void {
        this.setScale(this.facingRight ? 1 : -1, 1);
    }

    /**
     * 死亡
     */
    public die(): void {
        if (this.isDead) return;

        this.isDead = true;
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body) {
            body.stop();
        }

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.5,
            duration: 500,
            onComplete: () => {
                (this.scene as any).playerDied();
            }
        });
    }

    /**
     * 踩踏反弹
     */
    public bounce(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocityY(-250);
    }

    /**
     * 重生
     */
    public respawn(x: number, y: number): void {
        this.isDead = false;
        this.setPosition(x, y);
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body) {
            body.setVelocity(0, 0);
        }
        this.alpha = 1;
        this.setScale(1, 1);
        this.jumpCount = 0;
        this.setVisible(true);
    }

    destroy(): void {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }
}
