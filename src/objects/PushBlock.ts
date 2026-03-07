/**
 * 可推箱子类
 */

import Phaser from 'phaser';

export class PushBlock extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 50, height: number = 50) {
        // 先创建临时纹理
        const texture = PushBlock.createCrateTexture(scene, width, height);

        super(scene, x, y, texture);
        this.setOrigin(0, 0);
        this.setDisplaySize(width, height);

        // 添加物理
        scene.physics.add.existing(this);
        scene.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setFriction(0.8, 0);
        body.setBounce(0, 0);
        body.setMass(2);
        body.setDragX(400);
        body.setSize(width, height);

        // 监听碰撞以处理推动
        scene.events.on('update', this.update, this);
    }

    /**
     * 创建木箱纹理
     */
    private static createCrateTexture(scene: Phaser.Scene, width: number, height: number): Phaser.Textures.Texture {
        const key = `pushblock_${width}x${height}`;

        // 检查纹理是否已存在
        if (scene.textures.exists(key)) {
            return scene.textures.get(key);
        }

        // 使用 Graphics 绘制
        const graphics = scene.add.graphics();
        graphics.fillStyle(0xDEB887, 1);
        graphics.fillRect(0, 0, width, height);

        graphics.lineStyle(2, 0x333333, 1);
        graphics.strokeRect(0, 0, width, height);

        // 生成纹理
        graphics.generateTexture(key, width, height);
        graphics.destroy();

        return scene.textures.get(key);
    }

    public update(): void {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // 限制速度
        if (Math.abs(body.velocity.x) > 50) {
            body.setVelocityX(Math.sign(body.velocity.x) * 50);
        }
    }

    destroy(): void {
        this.scene.events.off('update', this.update, this);
        super.destroy();
    }
}
