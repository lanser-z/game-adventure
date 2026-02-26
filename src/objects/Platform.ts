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

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        type: string = 'static',
        data?: PlatformData
    ) {
        // 创建纹理 - 为每个尺寸创建唯一纹理
        const textureKey = `platform-${width}x${height}`;
        if (!scene.textures.exists(textureKey)) {
            const graphics = scene.make.graphics();
            graphics.fillStyle(0xCCCCCC, 1);
            graphics.fillRect(0, 0, width, height);
            graphics.lineStyle(3, 0x333333, 1);
            graphics.strokeRect(0, 0, width, height);
            graphics.generateTexture(textureKey, width, height);
        }

        // 计算中心点位置
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        super(scene, centerX, centerY, textureKey);

        // 设置显示尺寸
        this.setDisplaySize(width, height);

        // 添加到场景
        scene.add.existing(this);

        // 移动平台使用 DynamicBody，静态平台使用 StaticBody
        this.isMoving = type === 'moving';
        if (this.isMoving) {
            // 移动平台：使用动态物理体，但不受重力影响
            scene.physics.add.existing(this, false); // false = dynamic
            const body = this.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true); // 不可被玩家推动
            body.setAllowGravity(false); // 不受重力影响
            body.setVelocity(0, 0); // 初始速度为0
        } else {
            // 静态平台：使用静态物理体
            scene.physics.add.existing(this, true); // true = static
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

        // 创建往复运动的 tween
        this.scene.tweens.add({
            targets: this,
            x: endCenterX,
            y: endCenterY,
            duration: duration,
            ease: 'Linear.none',
            yoyo: true, // 往返运动
            repeat: -1 // 无限循环
        });
    }
}
