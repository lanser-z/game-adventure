/**
 * 平台类 - 使用 Image 而不是 Rectangle 以获得更好的物理支持
 */

import Phaser from 'phaser';

export interface PlatformData {
    type: string;
    position: [number, number];
    size: [number, number];
    path?: [number, number][];
    speed?: number;
}

export class Platform extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.StaticBody | Phaser.Physics.Arcade.Body;

    private isMoving: boolean = false;
    private preupdateCallback: (() => void) | null = null;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        type: string = 'static',
        data?: PlatformData
    ) {
        // 创建纹理 - 使用 Canvas API 以兼容微信小游戏
        const textureKey = `platform-${width}x${height}`;
        if (!scene.textures.exists(textureKey)) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;

            // 填充背景
            ctx.fillStyle = '#CCCCCC';
            ctx.fillRect(0, 0, width, height);

            // 绘制边框
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 3;
            ctx.strokeRect(0, 0, width, height);

            // 将 Canvas 添加到 Phaser 纹理管理器
            scene.textures.addCanvas(textureKey, canvas);
        }

        // 计算中心点位置
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        super(scene, centerX, centerY, textureKey);

        // 设置显示尺寸
        this.setDisplaySize(width, height);

        // 添加到场景
        scene.add.existing(this);
        this.isMoving = type === 'moving';
        if (this.isMoving) {
            // 移动平台：使用动态物理体，但不受重力影响
            scene.physics.add.existing(this, false); // false = dynamic
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true); // 不可被玩家推动
            body.setAllowGravity(false); // 不受重力影响
            body.setVelocity(0, 0); // 初始速度为0
            // 设置物理身体尺寸（与视觉对齐）
            body.setSize(width, height);
            body.setOffset(0, 0);
        } else {
            // 静态平台：使用静态物理体
            scene.physics.add.existing(this, true); // true = static
            const body = this.body as Phaser.Physics.Arcade.StaticBody;
            // 设置物理身体尺寸（与视觉对齐）
            body.setSize(width, height);
            body.setOffset(0, 0);
        }

        // 移动平台处理
        if (this.isMoving && data?.path) {
            this.setupMovement(data);
        }
    }

    /**
     * 设置移动平台的运动
     */
    private setupMovement(data: PlatformData): void {
        const path = data.path!;
        const speed = data.speed || 100;

        if (path.length < 2) return;

        // 起点和终点（path中的坐标都是左上角）
        const [startX, startY] = path[0];
        const [endX, endY] = path[1];

        // 转换为中心点坐标
        const startCenterX = startX + this.displayWidth / 2;
        const startCenterY = startY + this.displayHeight / 2;
        const endCenterX = endX + this.displayWidth / 2;
        const endCenterY = endY + this.displayHeight / 2;

        // 设置初始位置
        this.setPosition(startCenterX, startCenterY);

        // 计算持续时间
        const duration = Phaser.Math.Distance.Between(
            startCenterX, startCenterY,
            endCenterX, endCenterY
        ) / speed * 1000;

        // 创建往复运动的 tween，同时同步物理身体位置
        const tween = this.scene.tweens.add({
            targets: this,
            x: endCenterX,
            y: endCenterY,
            duration: duration,
            ease: 'Linear',
            yoyo: true, // 往返运动
            repeat: -1, // 无限循环
            onUpdate: () => {
                // 同步物理身体位置（在渲染前更新）
                const body = this.body as Phaser.Physics.Arcade.Body;
                if (body) {
                }
            }
        });

        // 使用 preupdate 确保在物理更新前同步位置
        this.preupdateCallback = () => {
            const body = this.body as Phaser.Physics.Arcade.Body;
            if (body && tween.isPlaying()) {
                // 强制同步物理身体到当前视觉位置
            }
        };
        this.scene.events.on('preupdate', this.preupdateCallback);
    }

    destroy(): void {
        if (this.scene && this.scene.events && this.preupdateCallback) {
            this.scene.events.off('preupdate', this.preupdateCallback);
        }
        super.destroy();
    }
}
