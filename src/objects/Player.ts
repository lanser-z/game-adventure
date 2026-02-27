/**
 * 玩家类 - 使用 Sprite 支持动画
 */

import Phaser from 'phaser';
import { TouchControls } from './TouchControls';

// 图片尺寸和显示尺寸（40x50，1:1）
const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 50;

export class Player extends Phaser.GameObjects.Sprite {
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
    private isGrounded: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        // 使用 player_idle_1 作为默认纹理
        super(scene, x, y, 'player_idle_1');

        // 创建动画
        this.createAnimations();

        // 设置缩放（将 256x320 缩放到 40x50）
        this.setScale(1, 1);

        // 添加到场景
        scene.add.existing(this);

        // 添加物理
        scene.physics.add.existing(this);

        // 设置物理属性
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
        body.setCollideWorldBounds(true);
        body.setBounce(0, 0);
        body.setDragX(500);
        body.setAllowGravity(true);

        // 设置输入
        this.setupInput();

        // 监听更新事件
        scene.events.on('update', this.update, this);

        // 播放待机动画
        this.play('idle', true);

        console.log('[Player] 使用图片精灵创建，缩放比例:', 1);
    }

    /**
     * 创建动画
     */
    private createAnimations(): void {
        const anims = this.anims;

        // 待机动画（呼吸）
        if (!anims.exists('idle')) {
            anims.create({
                key: 'idle',
                frames: [
                    { key: 'player_idle_1' },
                    { key: 'player_idle_2' }
                ],
                frameRate: 4,      // 每秒4帧，较慢
                repeat: -1         // 循环播放
            });
        }

        // 左走动画
        if (!anims.exists('walk_left')) {
            anims.create({
                key: 'walk_left',
                frames: [
                    { key: 'player_walk_left_1' },
                    { key: 'player_walk_left_2' }
                ],
                frameRate: 8,      // 走路稍快
                repeat: -1
            });
        }

        // 右走动画
        if (!anims.exists('walk_right')) {
            anims.create({
                key: 'walk_right',
                frames: [
                    { key: 'player_walk_right_1' },
                    { key: 'player_walk_right_2' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        // 跳跃动画（单帧）
        if (!anims.exists('jump')) {
            anims.create({
                key: 'jump',
                frames: [{ key: 'player_jump' }],
                frameRate: 1
            });
        }

        // 下落动画（单帧）
        if (!anims.exists('fall')) {
            anims.create({
                key: 'fall',
                frames: [{ key: 'player_fall' }],
                frameRate: 1
            });
        }

        console.log('[Player] 动画创建完成');
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

        this.isGrounded = body.touching.down || body.blocked.down;

        if (this.isGrounded) {
            this.jumpCount = 0;
        }
    }

    /**
     * 动画
     */
    private animate(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;
        const velocityX = body.velocity.x;
        const velocityY = body.velocity.y;

        // 设置朝向和缩放
        this.setScale(this.facingRight ? 1 : -1, 1);

        // 确定应该播放的动画
        let animKey = 'idle';

        if (!this.isGrounded) {
            // 空中状态
            if (velocityY < 0) {
                animKey = 'jump';   // 上升
            } else {
                animKey = 'fall';   // 下落
            }
        } else if (Math.abs(velocityX) > 10) {
            // 移动中
            animKey = this.facingRight ? 'walk_right' : 'walk_left';
        }

        // 只在需要时切换动画
        const currentAnim = this.anims.currentAnim;
        if (!this.anims.isPlaying || !currentAnim || currentAnim.key !== animKey) {
            this.play(animKey, true);
        }
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

        // 停止动画并定格
        this.anims.stop();

        // 死亡动画
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: this.facingRight ? 1 * 1.5 : -1 * 1.5,
            scaleY: 1 * 1.5,
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
        this.facingRight = true;
        this.play('idle', true);
    }

    destroy(): void {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }
}
