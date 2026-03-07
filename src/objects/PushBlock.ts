/**
 * 可推箱子类
 */

import Phaser from 'phaser';

export class PushBlock extends Phaser.GameObjects.Image {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number = 50, height: number = 50) {
        // 使用 block.svg 贴图
        super(scene, x, y, 'block');
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
